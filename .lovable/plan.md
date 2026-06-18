## Admin Panel Plan

A hidden `/admin` route reachable only by users with the `super-admin` role. Four sections covering users, content moderation, stats, and chat moderation.

### Routing & access guard
- New route `<Route path="/admin/*" element={<AdminRoute><Admin /></AdminRoute>} />` in `App.tsx`.
- New `src/components/AdminRoute.tsx`: wraps `ProtectedRoute`; calls `supabase.rpc('get_user_role', { _user_id: user.id })`; if role !== `super-admin`, redirect to `/` with a toast. Shows a loading spinner while checking.
- No visible nav link anywhere — admin types the URL directly.

### Page layout — `src/pages/Admin.tsx`
Top header "Admin Panel" + tabbed interface (shadcn `Tabs`) with 4 tabs. Mobile-friendly per project memory (safe areas, glassmorphism).

1. **Users** (`AdminUsersTab.tsx`)
   - Lists every row from `user_roles` joined with email from `auth.users` (via a new `admin_list_users` SECURITY DEFINER function that checks `has_role(auth.uid(),'super-admin')` and returns `user_id, email, role, created_at`).
   - Each row: email, current role badge, role dropdown (explorer / business / super-admin) to change role, Delete button.
   - Role change → `update public.user_roles set role=… where user_id=…` via supabase client (RLS already allows super-admins to manage roles).
   - Delete user → calls a new edge function `admin-delete-user` (service role) that removes the auth user + role rows.
   - Search box filters by email.

2. **Businesses & Deals** (`AdminContentTab.tsx`)
   - Reads businesses, deals, banners, reels from `localStorage` (same keys the rest of the app uses).
   - Sub-tabs: Businesses · Deals · Banners · Reels.
   - Each item: thumbnail, title, owner email if available, status badge, actions: Hide/Unhide (flips a `hiddenByAdmin` flag the existing list components already respect — small additions in their filters), Delete.
   - Note: localStorage is per-device; surface a yellow banner explaining "Moderation acts on this device's data only." (matches user's mixed storage reality).

3. **Analytics** (`AdminStatsTab.tsx`)
   - Cards: total users, users by role (from `user_roles` count grouped), total businesses / deals / banners / reels (from localStorage counts), active subscriptions (localStorage), revenue estimate from subscription tiers (reuse existing pricing memory).
   - Simple line chart of signups over time using `recharts` (already in deps) on `user_roles.created_at`.

4. **City Chat & Reports** (`AdminChatTab.tsx`)
   - Lists messages from the chat storage key with timestamps + sender.
   - Actions per message: Delete, Ban sender (writes user_id to a `bannedUsers` localStorage list; chat send hook is updated to refuse send if user is in that list).
   - "Clear all messages" button.
   - Reports list (currently no report system) — add a minimal "Report message" button on existing chat bubbles writing to localStorage `chatReports`, surfaced here with Dismiss / Delete-message actions.

### Database changes (single migration)
- `create or replace function public.admin_list_users()` returning `(user_id uuid, role app_role, created_at timestamptz, email text)`, `security definer`, `set search_path = public`, body checks `has_role(auth.uid(),'super-admin')` and selects from `user_roles u join auth.users a on a.id = u.user_id`.
- `grant execute on function public.admin_list_users() to authenticated;`
- `revoke execute on function public.admin_list_users() from anon, public;`

### Edge function
- `supabase/functions/admin-delete-user/index.ts`: verifies caller JWT → confirms super-admin via `has_role` → uses service role client to `auth.admin.deleteUser(targetId)` and delete from `user_roles`. CORS headers + zod input validation `{ user_id: string().uuid() }`.

### Files to create
- `src/components/AdminRoute.tsx`
- `src/pages/Admin.tsx`
- `src/components/admin/AdminUsersTab.tsx`
- `src/components/admin/AdminContentTab.tsx`
- `src/components/admin/AdminStatsTab.tsx`
- `src/components/admin/AdminChatTab.tsx`
- `supabase/functions/admin-delete-user/index.ts`
- migration for `admin_list_users`

### Files to edit
- `src/App.tsx` — add `/admin` route + lazy import.
- Existing list components for businesses/deals/banners/reels — filter out items where `hiddenByAdmin === true`.
- Chat send hook — block banned users.

### Note on external Supabase
The project's `src/integrations/supabase/client.ts` is auto-generated from current Lovable Cloud connection. If you've separately switched to an external Supabase, point me at how the client is wired and I'll adjust; the SQL above is portable.

### Out of scope (ask later if needed)
- Audit log of admin actions
- Bulk CSV export
- Email notifications to banned users

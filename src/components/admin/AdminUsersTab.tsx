import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search } from "lucide-react";

type Row = { user_id: string; email: string; role: "explorer" | "business" | "super-admin"; created_at: string };

export default function AdminUsersTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc("admin_list_users");
    if (error) {
      toast({ title: "Failed to load users", description: error.message, variant: "destructive" });
    } else {
      setRows((data as Row[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const changeRole = async (userId: string, role: Row["role"]) => {
    const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (delErr) {
      toast({ title: "Role update failed", description: delErr.message, variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
    if (error) {
      toast({ title: "Role update failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Role updated" });
    setRows((rs) => rs.map((r) => (r.user_id === userId ? { ...r, role } : r)));
  };

  const filtered = rows.filter((r) => r.email?.toLowerCase().includes(q.toLowerCase()));

  if (loading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email" className="pl-9" />
      </div>
      <p className="text-xs text-muted-foreground">{filtered.length} of {rows.length} users</p>
      {filtered.map((r) => (
        <Card key={r.user_id} className="p-3 backdrop-blur-md bg-card/70">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{r.email}</p>
                <p className="text-xs text-muted-foreground">
                  Joined {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <Badge variant={r.role === "super-admin" ? "destructive" : r.role === "business" ? "default" : "secondary"}>
                {r.role}
              </Badge>
            </div>
            <Select value={r.role} onValueChange={(v) => changeRole(r.user_id, v as Row["role"])}>
              <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="explorer">explorer</SelectItem>
                <SelectItem value="business">business</SelectItem>
                <SelectItem value="super-admin">super-admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      ))}
    </div>
  );
}

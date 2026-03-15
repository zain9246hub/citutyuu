import { useAuth, User, UserRole } from "@/contexts/AuthContext";
import { useMemo } from "react";

export const useEnhancedAuth = () => {
  const { currentUser, isLoading, login, signUp, logout } = useAuth();

  const userRoles = useMemo(() => ({
    isExplorer: currentUser?.role === 'explorer',
    isBusiness: currentUser?.role === 'business',
    isSuperAdmin: currentUser?.role === 'super-admin',
    isAuthenticated: !!currentUser,
    isGuest: !currentUser
  }), [currentUser]);

  const isValidUser = useMemo(() => {
    if (!currentUser) return false;
    return !!(currentUser.id && currentUser.email && currentUser.name && currentUser.role);
  }, [currentUser]);

  const permissions = useMemo(() => ({
    canViewAllSlots: userRoles.isExplorer || userRoles.isSuperAdmin,
    canBookSlots: userRoles.isBusiness,
    canUploadBusiness: userRoles.isBusiness || userRoles.isSuperAdmin,
    canViewBusinessProfiles: true,
    canAccessAnalytics: userRoles.isBusiness || userRoles.isSuperAdmin,
    canManageUsers: userRoles.isSuperAdmin
  }), [userRoles]);

  const enhancedLogin = async (email: string, password: string) => {
    if (!email || !password) throw new Error('All fields are required');
    await login(email, password);
  };

  const enhancedSignUp = async (name: string, email: string, password: string, role: UserRole, city?: string) => {
    if (!name || !email || !password || !role) throw new Error('All fields are required');
    await signUp(name, email, password, role, city);
  };

  const enhancedLogout = () => {
    try { logout(); } catch (error) { console.error('[useEnhancedAuth] Logout error:', error); }
  };

  return {
    currentUser, isLoading, isValidUser,
    ...userRoles,
    permissions,
    login: enhancedLogin,
    signUp: enhancedSignUp,
    logout: enhancedLogout,
    getUserDisplayName: () => currentUser?.name || currentUser?.email?.split('@')[0] || 'User',
    getUserRole: () => currentUser?.role || 'guest',
    hasPermission: (permission: keyof typeof permissions) => permissions[permission]
  };
};

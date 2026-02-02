import { useAuth, User, UserRole } from "@/contexts/AuthContext";
import { useMemo } from "react";

/**
 * Enhanced authentication hook with role-based utilities and validation
 */
export const useEnhancedAuth = () => {
  const { currentUser, isLoading, login, signUp, logout } = useAuth();

  // Memoized role checks for performance
  const userRoles = useMemo(() => ({
    isExplorer: currentUser?.role === 'explorer',
    isBusiness: currentUser?.role === 'business',
    isSuperAdmin: currentUser?.role === 'super-admin',
    isAuthenticated: !!currentUser,
    isGuest: !currentUser
  }), [currentUser]);

  // Enhanced user validation
  const isValidUser = useMemo(() => {
    if (!currentUser) return false;
    return !!(
      currentUser.id && 
      currentUser.email && 
      currentUser.name && 
      currentUser.role
    );
  }, [currentUser]);

  // Role-based feature access
  const permissions = useMemo(() => ({
    canViewAllSlots: userRoles.isExplorer || userRoles.isSuperAdmin,
    canBookSlots: userRoles.isBusiness,
    canUploadBusiness: userRoles.isBusiness || userRoles.isSuperAdmin,
    canViewBusinessProfiles: true, // All users
    canAccessAnalytics: userRoles.isBusiness || userRoles.isSuperAdmin,
    canManageUsers: userRoles.isSuperAdmin
  }), [userRoles]);

  // Enhanced login with validation
  const enhancedLogin = async (email: string, password: string, role: UserRole) => {
    try {
      if (!email || !password || !role) {
        throw new Error('All fields are required');
      }
      
      await login(email, password, role);
      console.log('[useEnhancedAuth] Login successful for role:', role);
    } catch (error) {
      console.error('[useEnhancedAuth] Login failed:', error);
      throw error;
    }
  };

  // Enhanced signup with validation
  const enhancedSignUp = async (name: string, email: string, password: string, role: UserRole, city?: string) => {
    try {
      if (!name || !email || !password || !role) {
        throw new Error('All fields are required');
      }
      
      await signUp(name, email, password, role, city);
      console.log('[useEnhancedAuth] Signup successful for role:', role, 'city:', city);
    } catch (error) {
      console.error('[useEnhancedAuth] Signup failed:', error);
      throw error;
    }
  };

  // Enhanced logout with cleanup
  const enhancedLogout = () => {
    try {
      logout();
      console.log('[useEnhancedAuth] Logout successful');
    } catch (error) {
      console.error('[useEnhancedAuth] Logout error:', error);
    }
  };

  return {
    // User data
    currentUser,
    isLoading,
    isValidUser,
    
    // Role checks
    ...userRoles,
    
    // Permissions
    permissions,
    
    // Enhanced auth methods
    login: enhancedLogin,
    signUp: enhancedSignUp,
    logout: enhancedLogout,
    
    // Utility methods
    getUserDisplayName: () => currentUser?.name || currentUser?.email?.split('@')[0] || 'User',
    getUserRole: () => currentUser?.role || 'guest',
    hasPermission: (permission: keyof typeof permissions) => permissions[permission]
  };
};
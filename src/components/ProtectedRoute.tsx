
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "explorer" | "business" | "super-admin" | undefined;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      navigate("/login");
    } else if (
      !isLoading && 
      currentUser && 
      requiredRole && 
      currentUser.role !== requiredRole
    ) {
      toast({
        title: "Access denied",
        description: `Only ${requiredRole}s can access this page`,
        variant: "destructive",
      });
      navigate("/profile");
    }
  }, [currentUser, isLoading, navigate, requiredRole, toast]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;

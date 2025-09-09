
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

const NotLoggedIn = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 max-w-md mx-auto w-full flex flex-col items-center justify-center p-4">
        <UserCircle className="h-16 w-16 text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Not Logged In</h1>
        <p className="text-gray-500 mb-8 text-center">
          Please log in or create an account to view your profile
        </p>
        <div className="flex gap-4">
          <Button onClick={() => navigate("/login")}>Login</Button>
          <Button variant="outline" onClick={() => navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedIn;


import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";

interface ThemeToggleProps {
  variant?: "button" | "toggle";
  className?: string;
}

// This component is now a placeholder that always shows the light mode icon
// It's kept for compatibility with existing code
const ThemeToggle = ({ variant = "button", className = "" }: ThemeToggleProps) => {
  const { toggleTheme } = useTheme();
  
  if (variant === "toggle") {
    return (
      <Toggle 
        pressed={false}
        onPressedChange={toggleTheme}
        className={`p-2 ${className}`}
        aria-label="Theme"
      >
        <Sun className="h-4 w-4" />
      </Toggle>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label="Theme"
    >
      <Sun className="h-5 w-5" />
    </Button>
  );
};

export default ThemeToggle;

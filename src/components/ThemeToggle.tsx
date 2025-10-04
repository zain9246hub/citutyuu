
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Toggle } from "@/components/ui/toggle";

interface ThemeToggleProps {
  variant?: "button" | "toggle";
  className?: string;
}

const ThemeToggle = ({ variant = "button", className = "" }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  
  if (variant === "toggle") {
    return (
      <Toggle 
        pressed={theme === "dark"}
        onPressedChange={toggleTheme}
        className={`p-2 ${className}`}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Toggle>
    );
  }
  
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 transition-transform duration-200" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-200" />
      )}
    </Button>
  );
};

export default ThemeToggle;

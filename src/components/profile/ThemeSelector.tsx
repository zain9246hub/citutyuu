import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      id: "light" as const,
      name: "Light",
      description: "Clean and bright interface",
      icon: Sun,
      gradient: "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      border: "border-amber-200/50 dark:border-amber-800/50",
      iconBg: "bg-gradient-to-br from-amber-400 to-orange-500",
      iconColor: "text-white",
    },
    {
      id: "dark" as const,
      name: "Dark",
      description: "Easy on the eyes",
      icon: Moon,
      gradient: "from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/50",
      border: "border-slate-200/50 dark:border-slate-800/50",
      iconBg: "bg-gradient-to-br from-slate-700 to-slate-900",
      iconColor: "text-white",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Choose your preferred color scheme for the app
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        {themes.map((themeOption) => {
          const isSelected = theme === themeOption.id;
          const Icon = themeOption.icon;
          
          return (
            <Card
              key={themeOption.id}
              className={`
                group relative overflow-hidden cursor-pointer transition-all duration-300
                ${isSelected 
                  ? `ring-2 ring-primary shadow-lg shadow-primary/20 ${themeOption.border}` 
                  : `${themeOption.border} hover:shadow-md hover:scale-[1.02]`
                }
                bg-gradient-to-br ${themeOption.gradient}
              `}
              onClick={() => setTheme(themeOption.id)}
            >
              <div className="p-5">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div 
                    className={`
                      w-14 h-14 rounded-2xl ${themeOption.iconBg} 
                      flex items-center justify-center shadow-lg
                      transition-transform duration-300 group-hover:scale-110
                      ${isSelected ? 'scale-105' : ''}
                    `}
                  >
                    <Icon className={`h-7 w-7 ${themeOption.iconColor}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground">
                      {themeOption.name}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {themeOption.description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-primary-foreground"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;

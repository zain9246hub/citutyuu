
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MenuItem {
  name: string;
  price: string;
  description: string;
  image: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
}

interface MenuTabProps {
  menuCategories: MenuCategory[];
}

const MenuTab = ({ menuCategories }: MenuTabProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-400px)]">
      {menuCategories.map((category) => (
        <div key={category.id} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{category.name}</h3>
          
          <div className="space-y-4">
            {category.items.map((item, index) => (
              <div key={index} className="flex gap-3 border rounded-lg overflow-hidden">
                <div className="w-24 h-24 flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-3">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{item.name}</h4>
                    <span className="font-semibold">{item.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};

export default MenuTab;

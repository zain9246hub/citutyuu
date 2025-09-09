import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface ProductServiceUploaderProps {
  type: "products" | "services";
  items: ProductService[];
  setItems: (items: ProductService[]) => void;
}

const ProductServiceUploader = ({ type, items, setItems }: ProductServiceUploaderProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });

  const handleAddNew = () => {
    if (!newItem.name.trim()) return;
    
    const newProduct: ProductService = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price: newItem.price,
      image: newItem.image
    };
    
    setItems([...items, newProduct]);
    setNewItem({ name: "", description: "", price: "", image: "" });
    setIsAdding(false);
  };

  const handleRemove = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewItem(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const label = type === "products" ? "Product" : "Service";
  const labels = type === "products" ? "Products" : "Services";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-base font-medium">{labels}</Label>
          <p className="text-sm text-muted-foreground">
            Add {type} with images, descriptions and pricing
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add {label}
        </Button>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex gap-4">
              {item.image && (
                <div className="flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium truncate">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}
                    {item.price && (
                      <Badge variant="secondary" className="mt-2">
                        ₹{item.price}
                      </Badge>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {isAdding && (
          <Card className="p-4 border-dashed">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Add New {label}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`${type}-name`}>{label} Name *</Label>
                    <Input
                      id={`${type}-name`}
                      value={newItem.name}
                      onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={`Enter ${label.toLowerCase()} name`}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${type}-description`}>Description</Label>
                    <Textarea
                      id={`${type}-description`}
                      value={newItem.description}
                      onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                      placeholder={`Describe your ${label.toLowerCase()}`}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`${type}-price`}>Price (₹)</Label>
                    <Input
                      id={`${type}-price`}
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                      type="number"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>{label} Image</Label>
                    <div className="mt-2">
                      {newItem.image ? (
                        <div className="relative">
                          <img
                            src={newItem.image}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => setNewItem(prev => ({ ...prev, image: "" }))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400" />
                            <p className="text-sm text-gray-500">Upload image</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  type="button"
                  onClick={handleAddNew}
                  disabled={!newItem.name.trim()}
                  className="flex-1"
                >
                  Add {label}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductServiceUploader;
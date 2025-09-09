
import React from "react";
import { Button } from "@/components/ui/button";

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  image: string;
}

interface ProductsTabProps {
  products: Product[];
}

const ProductsTab = ({ products }: ProductsTabProps) => {
  return (
    <div className="space-y-6 py-2">
      <h2 className="text-lg font-semibold mb-4">Products & Services</h2>
      
      {products.map((product) => (
        <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="h-40 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-3">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            
            <div className="mt-2 flex justify-between items-center">
              <span className="font-semibold text-blue-600">{product.price}</span>
              <Button size="sm" variant="outline">
                Inquire
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsTab;

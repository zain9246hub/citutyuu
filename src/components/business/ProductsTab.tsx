
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="space-y-6 py-2">
      <h2 className="text-lg font-semibold mb-4">Products & Services</h2>
      
      {products.map((product) => (
        <div 
          key={product.id} 
          className="border border-border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => setSelectedProduct(product)}
        >
          <div className="h-40 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-3">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold">{product.name}</h3>
              <span className="font-semibold text-primary">{product.price}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
          </div>
        </div>
      ))}

      {/* Product Detail Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          {selectedProduct && (
            <>
              <div className="w-full aspect-square">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-3">
                <DialogHeader className="p-0">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-xl font-semibold">
                      {selectedProduct.name}
                    </DialogTitle>
                    <Badge className="text-base px-3 py-1">
                      {selectedProduct.price}
                    </Badge>
                  </div>
                </DialogHeader>
                <p className="text-muted-foreground">
                  {selectedProduct.description}
                </p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsTab;

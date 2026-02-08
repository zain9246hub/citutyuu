import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Product } from "@/data/businessData";

interface EnhancedProductsTabProps {
  products: Product[];
}

const EnhancedProductsTab = ({ products }: EnhancedProductsTabProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="py-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Products & Services</h2>
        <Badge variant="secondary" className="text-xs">
          {products.length} Available
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {products.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="flex">
              {/* Product Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Product Details */}
              <div className="flex-1 p-4">
                <CardHeader className="p-0 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium line-clamp-1">
                        {product.name}
                      </CardTitle>
                      {product.category && (
                        <Badge variant="outline" className="text-xs mt-1 w-fit">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right ml-2">
                      <div className="text-lg font-bold text-primary">
                        {product.price}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-0">
                  <CardDescription className="text-sm line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardContent>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground text-sm">
            No products or services available at the moment.
          </div>
        </div>
      )}

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
                    <div className="text-xl font-bold text-primary">
                      {selectedProduct.price}
                    </div>
                  </div>
                  {selectedProduct.category && (
                    <Badge variant="outline" className="w-fit mt-2">
                      {selectedProduct.category}
                    </Badge>
                  )}
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

export default EnhancedProductsTab;
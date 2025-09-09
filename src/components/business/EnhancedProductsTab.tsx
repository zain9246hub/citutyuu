import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageCircle } from "lucide-react";
import { Product } from "@/data/businessData";

interface EnhancedProductsTabProps {
  products: Product[];
}

const EnhancedProductsTab = ({ products }: EnhancedProductsTabProps) => {
  const handleInquiry = (productName: string) => {
    // This would typically open a contact form or redirect to inquiry page
    console.log(`Inquiry for: ${productName}`);
  };

  const handleAddToCart = (productId: string) => {
    // This would typically add to cart or booking system
    console.log(`Add to cart: ${productId}`);
  };

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
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
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
                
                <CardContent className="p-0 pb-3">
                  <CardDescription className="text-sm line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardContent>
                
                <CardFooter className="p-0 flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="flex-1 text-xs h-8"
                    onClick={() => handleInquiry(product.name)}
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Inquire
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 text-xs h-8"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    Book Now
                  </Button>
                </CardFooter>
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
      
      {/* Contact for custom solutions */}
      <Card className="bg-muted/30 border-dashed">
        <CardContent className="p-4 text-center">
          <h3 className="font-medium text-foreground mb-2">Need something custom?</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Contact us for personalized solutions tailored to your business needs.
          </p>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4 mr-2" />
            Get Custom Quote
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedProductsTab;
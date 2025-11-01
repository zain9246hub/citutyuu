import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import GooglePayButton from "@/components/payment/GooglePayButton";
import { Separator } from "@/components/ui/separator";
import { DealTier } from "@/types/deal";
import { Badge, MapPin, Megaphone } from "lucide-react";

interface TierPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: DealTier;
  price: number;
  isMetro: boolean;
  zipCodeCount: number;
  isProcessingPayment: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const TierPaymentDialog = ({
  open,
  onOpenChange,
  tier,
  price,
  isMetro,
  zipCodeCount,
  isProcessingPayment,
  onCancel,
  onConfirm
}: TierPaymentDialogProps) => {
  const getTierLabel = () => {
    switch (tier) {
      case 'standard':
        return 'Standard Deal';
      case 'highlight':
        return 'Highlight Deal';
      case 'citywide':
        return 'City-Wide Push Notifications';
      default:
        return 'Deal';
    }
  };

  const getTierIcon = () => {
    switch (tier) {
      case 'standard':
        return <MapPin className="h-5 w-5" />;
      case 'highlight':
        return <Badge className="h-5 w-5" />;
      case 'citywide':
        return <Megaphone className="h-5 w-5" />;
    }
  };

  const handleGooglePaySuccess = (paymentData: any) => {
    console.log('Google Pay payment successful:', paymentData);
    onConfirm();
  };

  const handleGooglePayError = (error: any) => {
    console.error('Google Pay payment error:', error);
  };

  const handleTraditionalPayment = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Complete Your Payment</DialogTitle>
          <DialogDescription>
            Choose your preferred payment method to post your deal.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center gap-2 mb-3">
              {getTierIcon()}
              <span className="font-semibold">{getTierLabel()}</span>
              {isMetro && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Metro City
                </span>
              )}
            </div>
            
            <div className="space-y-2 text-sm text-gray-600">
              {tier === 'standard' && (
                <p>• Targeted to {zipCodeCount} zip code{zipCodeCount > 1 ? 's' : ''}</p>
              )}
              {tier === 'highlight' && (
                <>
                  <p>• Featured on home page</p>
                  <p>• Targeted to {zipCodeCount} zip codes</p>
                </>
              )}
              {tier === 'citywide' && (
                <>
                  <p>• Push notifications to entire city</p>
                  <p>• Featured on home page</p>
                </>
              )}
              <p>• Shown in Explore Deals page</p>
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center">
              <span className="font-medium">Total (all taxes included):</span>
              <span className="text-xl font-bold">₹{price}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Payment Options</h3>
            
            {/* Google Pay Option */}
            <GooglePayButton
              amount={price}
              currency="INR"
              onPaymentSuccess={handleGooglePaySuccess}
              onPaymentError={handleGooglePayError}
              disabled={isProcessingPayment}
            />

            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <span className="text-xs text-gray-500">OR</span>
              <Separator className="flex-1" />
            </div>

            {/* Traditional Payment Option */}
            <Button 
              onClick={handleTraditionalPayment} 
              disabled={isProcessingPayment}
              variant="outline"
              className="w-full"
            >
              {isProcessingPayment ? `Processing Payment...` : `Pay ₹${price} (Other Methods)`}
            </Button>
          </div>
          
          <p className="text-sm text-gray-500">
            By proceeding, you agree to our terms and conditions for deal posting.
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isProcessingPayment}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TierPaymentDialog;

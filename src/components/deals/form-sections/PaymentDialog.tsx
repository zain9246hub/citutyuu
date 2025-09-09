
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

interface DurationOption {
  days: number;
  label: string;
  baseCost: number;
  featuredCost: number;
}

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration: number;
  isFeatured: boolean;
  isProcessingPayment: boolean;
  durationOptions: DurationOption[];
  calculatePrice: () => number;
  onCancel: () => void;
  onConfirm: () => void;
}

const PaymentDialog = ({
  open,
  onOpenChange,
  duration,
  isFeatured,
  isProcessingPayment,
  durationOptions,
  calculatePrice,
  onCancel,
  onConfirm
}: PaymentDialogProps) => {
  const selectedDuration = durationOptions.find(option => option.days === duration);

  const handleGooglePaySuccess = (paymentData: any) => {
    console.log('Google Pay payment successful:', paymentData);
    onConfirm();
  };

  const handleGooglePayError = (error: any) => {
    console.error('Google Pay payment error:', error);
  };

  const handleTraditionalPayment = () => {
    // Simulate traditional payment processing
    setTimeout(() => {
      onConfirm();
    }, 2000);
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
            <div className="flex justify-between items-center">
              <span>Deal posting fee ({duration} days):</span>
              <span className="font-medium">
                ₹{selectedDuration?.baseCost || 120}
              </span>
            </div>
            
            {isFeatured && (
              <div className="flex justify-between items-center mt-2">
                <span>Featured deal premium:</span>
                <span className="font-medium">
                  ₹{selectedDuration?.featuredCost || 200}
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center font-medium">
              <span>Total:</span>
              <span>₹{calculatePrice()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">Payment Options</h3>
            
            {/* Google Pay Option */}
            <GooglePayButton
              amount={calculatePrice()}
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
              {isProcessingPayment ? `Processing Payment...` : `Pay ₹${calculatePrice()} (Other Methods)`}
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

export default PaymentDialog;


import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface GooglePayButtonProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentError: (error: any) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    google: any;
  }
}

const GooglePayButton = ({
  amount,
  currency = 'INR',
  onPaymentSuccess,
  onPaymentError,
  disabled = false
}: GooglePayButtonProps) => {
  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [paymentsClient, setPaymentsClient] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const baseRequest = {
    apiVersion: 2,
    apiVersionMinor: 0
  };

  const allowedPaymentMethods = [
    {
      type: 'CARD',
      parameters: {
        allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
        allowedCardNetworks: ['MASTERCARD', 'VISA', 'RUPAY']
      },
      tokenizationSpecification: {
        type: 'PAYMENT_GATEWAY',
        parameters: {
          // Replace with your actual payment gateway details
          gateway: 'stripe', // or your payment processor (e.g., 'razorpay', 'payu', etc.)
          gatewayMerchantId: 'your-gateway-merchant-id' // Replace with your actual merchant ID
        }
      }
    }
  ];

  const paymentDataRequest = {
    ...baseRequest,
    allowedPaymentMethods,
    transactionInfo: {
      totalPriceStatus: 'FINAL',
      totalPriceLabel: 'Total',
      totalPrice: amount.toString(),
      currencyCode: currency
    },
    merchantInfo: {
      merchantName: 'Your Business Name', // Replace with your actual business name
      merchantId: 'your-google-merchant-id' // Replace with your Google Merchant ID
    }
  };

  useEffect(() => {
    const initializeGooglePay = async () => {
      if (typeof window.google !== 'undefined') {
        try {
          const client = new window.google.payments.api.PaymentsClient({
            environment: 'PRODUCTION' // Production environment for live payments
          });

          const isReadyToPay = await client.isReadyToPay({
            ...baseRequest,
            allowedPaymentMethods
          });

          if (isReadyToPay.result) {
            setPaymentsClient(client);
            setIsGooglePayReady(true);
          }
        } catch (error) {
          console.error('Google Pay initialization error:', error);
        }
      }
    };

    // Load Google Pay API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = initializeGooglePay;
      document.head.appendChild(script);
    } else {
      initializeGooglePay();
    }
  }, []);

  const handleGooglePayClick = async () => {
    if (!paymentsClient) {
      toast({
        title: "Google Pay Unavailable",
        description: "Please use the alternative payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      console.log('Payment successful:', paymentData);
      
      // Simulate payment processing
      setTimeout(() => {
        onPaymentSuccess(paymentData);
        setIsProcessing(false);
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully!",
        });
      }, 1500);
      
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      onPaymentError(error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isGooglePayReady) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className="w-full bg-gray-100 text-gray-500"
      >
        Google Pay Not Available
      </Button>
    );
  }

  return (
    <Button
      onClick={handleGooglePayClick}
      disabled={disabled || isProcessing}
      className="w-full bg-black hover:bg-gray-800 text-white font-medium py-3"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Pay with Google Pay
        </>
      )}
    </Button>
  );
};

export default GooglePayButton;

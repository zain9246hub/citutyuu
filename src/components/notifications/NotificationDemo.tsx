import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';
import { Bell, MapPin, Phone } from 'lucide-react';

const NotificationDemo = () => {
  const { addNotification } = useNotifications();

  const addDemoNotification = () => {
    addNotification({
      type: 'new_deal',
      title: '🔥 Flash Sale at Pizza Palace!',
      message: 'Get 50% off on all pizzas! Valid till midnight. Call now to place your order.',
      city: 'Mumbai',
      dealId: 123,
      shopLocation: 'Pizza Palace, Shop 45, Linking Road, Bandra West, Mumbai 400050',
      phoneNumber: '+91 98765 43210'
    });
  };

  const addDemoNotificationWithLocation = () => {
    addNotification({
      type: 'expiring_deal',
      title: '⏰ Deal Ending Soon!',
      message: 'Only 2 hours left for 30% off at Cafe Mocha. Located near Bandra Station.',
      city: 'Delhi',
      dealId: 124,
      shopLocation: 'Cafe Mocha, CP Block, Connaught Place, New Delhi 110001',
      phoneNumber: '+91 87654 32109'
    });
  };

  const addDemoNotificationWithPhone = () => {
    addNotification({
      type: 'price_drop',
      title: '💰 Price Drop Alert!',
      message: 'Electronics store reduced prices by 40%! Limited stock available.',
      city: 'Bangalore',
      dealId: 125,
      phoneNumber: '+91 76543 21098'
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Demo Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={addDemoNotification} 
          className="w-full justify-start"
          variant="outline"
        >
          <MapPin className="w-4 h-4 mr-2" />
          <Phone className="w-4 h-4 mr-2" />
          Add notification with location & phone
        </Button>
        
        <Button 
          onClick={addDemoNotificationWithLocation} 
          className="w-full justify-start"
          variant="outline"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Add notification with location only
        </Button>
        
        <Button 
          onClick={addDemoNotificationWithPhone} 
          className="w-full justify-start"
          variant="outline"
        >
          <Phone className="w-4 h-4 mr-2" />
          Add notification with phone only
        </Button>
        
        <div className="text-xs text-muted-foreground mt-3 p-2 bg-muted/50 rounded">
          <p>💡 <strong>Try the demo:</strong></p>
          <p>• Location buttons open Google Maps</p>
          <p>• Phone numbers open your dialer</p>
          <p>• Both are clickable in notifications</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationDemo;
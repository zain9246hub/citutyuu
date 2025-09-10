
import React from 'react';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import NotificationList from '@/components/notifications/NotificationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationsTab = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="mt-0">
          <NotificationList />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0 p-4 bg-background border rounded-b-lg">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsTab;

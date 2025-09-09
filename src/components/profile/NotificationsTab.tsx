
import React from 'react';
import NotificationSettings from '@/components/notifications/NotificationSettings';
import NotificationList from '@/components/notifications/NotificationList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NotificationsTab = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Recent Notifications</TabsTrigger>
          <TabsTrigger value="settings">Notification Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="mt-6">
          <NotificationList />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <NotificationSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsTab;

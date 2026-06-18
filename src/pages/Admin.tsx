import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AdminUsersTab from "@/components/admin/AdminUsersTab";
import AdminContentTab from "@/components/admin/AdminContentTab";
import AdminStatsTab from "@/components/admin/AdminStatsTab";
import AdminChatTab from "@/components/admin/AdminChatTab";

export default function Admin() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background pb-24"
         style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-background/70 border-b">
        <div className="flex items-center gap-3 px-4 h-14">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Shield className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold">Admin Panel</h1>
        </div>
      </header>

      <main className="px-4 py-4">
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
          </TabsList>
          <TabsContent value="stats"><AdminStatsTab /></TabsContent>
          <TabsContent value="users"><AdminUsersTab /></TabsContent>
          <TabsContent value="content"><AdminContentTab /></TabsContent>
          <TabsContent value="chat"><AdminChatTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

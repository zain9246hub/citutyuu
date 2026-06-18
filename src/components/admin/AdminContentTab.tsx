import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const KEYS = {
  businesses: "businesses",
  deals: "deals",
  banners: "banners",
  reels: "reels",
};

function readArr(key: string): any[] {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : []; } catch { return []; }
}
function writeArr(key: string, arr: any[]) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function ItemList({ storageKey, titleField }: { storageKey: string; titleField: string }) {
  const [items, setItems] = useState<any[]>([]);
  const { toast } = useToast();
  useEffect(() => { setItems(readArr(storageKey)); }, [storageKey]);

  const remove = (id: string) => {
    const next = items.filter((i) => String(i.id) !== String(id));
    writeArr(storageKey, next);
    setItems(next);
    toast({ title: "Deleted" });
  };

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-6">No items</p>;
  }
  return (
    <div className="space-y-2">
      {items.map((it: any) => (
        <Card key={it.id} className="p-3 flex items-center gap-3 backdrop-blur-md bg-card/70">
          {it.image && <img src={it.image} alt="" className="w-12 h-12 rounded object-cover" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{it[titleField] || it.title || it.name || "Untitled"}</p>
            <p className="text-xs text-muted-foreground truncate">ID: {it.id}</p>
          </div>
          <Button size="icon" variant="ghost" onClick={() => remove(it.id)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </Card>
      ))}
    </div>
  );
}

export default function AdminContentTab() {
  return (
    <div className="space-y-3">
      <Card className="p-3 flex items-start gap-2 border-yellow-500/40 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
        <p className="text-xs">Content lives in this device's local storage. Moderation only affects this device.</p>
      </Card>
      <Tabs defaultValue="businesses">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="businesses">Biz</TabsTrigger>
          <TabsTrigger value="deals">Deals</TabsTrigger>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="reels">Reels</TabsTrigger>
        </TabsList>
        <TabsContent value="businesses" className="mt-3"><ItemList storageKey={KEYS.businesses} titleField="name" /></TabsContent>
        <TabsContent value="deals" className="mt-3"><ItemList storageKey={KEYS.deals} titleField="title" /></TabsContent>
        <TabsContent value="banners" className="mt-3"><ItemList storageKey={KEYS.banners} titleField="title" /></TabsContent>
        <TabsContent value="reels" className="mt-3"><ItemList storageKey={KEYS.reels} titleField="title" /></TabsContent>
      </Tabs>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Ban, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CHAT_KEYS = ["cityChatMessages", "chatMessages", "messages"];
const BAN_KEY = "bannedUsers";

function findChatKey(): string {
  for (const k of CHAT_KEYS) {
    if (localStorage.getItem(k)) return k;
  }
  return CHAT_KEYS[0];
}
function readArr(k: string): any[] {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : []; } catch { return []; }
}

export default function AdminChatTab() {
  const [messages, setMessages] = useState<any[]>([]);
  const [banned, setBanned] = useState<string[]>([]);
  const [chatKey] = useState(findChatKey());
  const { toast } = useToast();

  useEffect(() => {
    setMessages(readArr(chatKey));
    setBanned(readArr(BAN_KEY));
  }, [chatKey]);

  const removeMsg = (id: string) => {
    const next = messages.filter((m) => String(m.id) !== String(id));
    localStorage.setItem(chatKey, JSON.stringify(next));
    setMessages(next);
    toast({ title: "Message deleted" });
  };

  const ban = (userId: string) => {
    if (!userId) return;
    const next = Array.from(new Set([...banned, userId]));
    localStorage.setItem(BAN_KEY, JSON.stringify(next));
    setBanned(next);
    toast({ title: "User banned", description: userId });
  };

  const unban = (userId: string) => {
    const next = banned.filter((u) => u !== userId);
    localStorage.setItem(BAN_KEY, JSON.stringify(next));
    setBanned(next);
  };

  const clearAll = () => {
    if (!confirm("Delete all messages?")) return;
    localStorage.setItem(chatKey, JSON.stringify([]));
    setMessages([]);
    toast({ title: "Chat cleared" });
  };

  return (
    <div className="space-y-3">
      <Card className="p-3 flex items-start gap-2 border-yellow-500/40 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
        <p className="text-xs">Chat messages live in this device's local storage.</p>
      </Card>

      {banned.length > 0 && (
        <Card className="p-3 backdrop-blur-md bg-card/70">
          <p className="text-xs font-semibold mb-2">Banned users ({banned.length})</p>
          <div className="flex flex-wrap gap-1">
            {banned.map((u) => (
              <button key={u} onClick={() => unban(u)}
                className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20">
                {u.slice(0, 8)}… ✕
              </button>
            ))}
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{messages.length} messages</p>
        <Button size="sm" variant="destructive" onClick={clearAll} disabled={messages.length === 0}>
          Clear all
        </Button>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No messages</p>
      ) : (
        <div className="space-y-2">
          {messages.slice(-100).reverse().map((m: any) => (
            <Card key={m.id} className="p-3 backdrop-blur-md bg-card/70">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">
                    {m.userName || m.senderName || "User"} · {m.userId?.slice(0, 8) || m.senderId?.slice(0, 8) || "?"}
                  </p>
                  <p className="text-sm break-words">{m.text || m.content || m.message || "[media]"}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Button size="icon" variant="ghost" onClick={() => removeMsg(m.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => ban(m.userId || m.senderId)}>
                    <Ban className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Users, Building2, Tag, Image, Film, Loader2 } from "lucide-react";

function readArr(key: string): any[] {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : []; } catch { return []; }
}

export default function AdminStatsTab() {
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ total: 0, explorer: 0, business: 0, admin: 0 });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.rpc("admin_list_users");
      const rows = (data as any[]) ?? [];
      setCounts({
        total: rows.length,
        explorer: rows.filter((r) => r.role === "explorer").length,
        business: rows.filter((r) => r.role === "business").length,
        admin: rows.filter((r) => r.role === "super-admin").length,
      });
      setLoading(false);
    })();
  }, []);

  const local = {
    businesses: readArr("businesses").length,
    deals: readArr("deals").length,
    banners: readArr("banners").length,
    reels: readArr("reels").length,
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  const Stat = ({ icon: Icon, label, value }: any) => (
    <Card className="p-4 backdrop-blur-md bg-card/70">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold mb-2">Users</h2>
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Users} label="Total users" value={counts.total} />
          <Stat icon={Users} label="Explorers" value={counts.explorer} />
          <Stat icon={Users} label="Businesses" value={counts.business} />
          <Stat icon={Users} label="Super admins" value={counts.admin} />
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold mb-2">Content (this device)</h2>
        <div className="grid grid-cols-2 gap-2">
          <Stat icon={Building2} label="Businesses" value={local.businesses} />
          <Stat icon={Tag} label="Deals" value={local.deals} />
          <Stat icon={Image} label="Banners" value={local.banners} />
          <Stat icon={Film} label="Reels" value={local.reels} />
        </div>
      </div>
    </div>
  );
}

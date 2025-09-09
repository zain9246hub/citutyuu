
import { MousePointer, Eye, Star, TrendingUp, DollarSign, Users } from "lucide-react";
import { AnalyticsCard } from "./AnalyticsCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface BusinessAnalyticsProps {
  businessId?: string;
}

export default function BusinessAnalytics({ businessId }: BusinessAnalyticsProps) {
  // This would typically come from an API call using the businessId
  // For now, we'll use mock data
  const analyticsData = {
    clicks: 238,
    clicksChange: "+12% from last month",
    clicksTrend: "up" as const,
    views: 1024,
    viewsChange: "+5% from last month",
    viewsTrend: "up" as const,
    calls: 45,
    callsChange: "-3% from last month",
    callsTrend: "down" as const,
    ratings: 4.7,
    saves: 72,
    savesChange: "+15% from last month",
    savesTrend: "up" as const,
    revenue: 5200,
  };

  const topDeals = [
    { id: 1, name: "Summer Special Discount", clicks: 85, views: 340, conversion: "25%" },
    { id: 2, name: "Weekend Flash Sale", clicks: 62, views: 210, conversion: "29%" },
    { id: 3, name: "Holiday Package", clicks: 51, views: 180, conversion: "28%" },
    { id: 4, name: "Loyalty Member Offer", clicks: 40, views: 294, conversion: "14%" },
  ];

  return (
    <div className="space-y-5">
      <h3 className="text-lg font-semibold">Business Analytics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <AnalyticsCard 
          title="Total Clicks" 
          value={analyticsData.clicks}
          change={analyticsData.clicksChange}
          trend={analyticsData.clicksTrend}
          icon={<MousePointer className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Profile Views" 
          value={analyticsData.views}
          change={analyticsData.viewsChange}
          trend={analyticsData.viewsTrend}
          icon={<Eye className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Phone Calls" 
          value={analyticsData.calls}
          change={analyticsData.callsChange}
          trend={analyticsData.callsTrend} 
          icon={<Users className="h-4 w-4" />}
        />
        <AnalyticsCard 
          title="Saved Deals" 
          value={analyticsData.saves}
          change={analyticsData.savesChange}
          trend={analyticsData.savesTrend}
          icon={<Star className="h-4 w-4" />}
        />
      </div>

      <Tabs defaultValue="deals">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deals">Top Deals</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="deals" className="pt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topDeals.map(deal => (
                <TableRow key={deal.id}>
                  <TableCell>{deal.name}</TableCell>
                  <TableCell className="text-right">{deal.views}</TableCell>
                  <TableCell className="text-right">{deal.clicks}</TableCell>
                  <TableCell className="text-right">{deal.conversion}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="revenue" className="pt-4">
          <div className="flex flex-col items-center py-8">
            <DollarSign className="h-12 w-12 text-primary mb-2" />
            <h3 className="text-2xl font-bold">₹{analyticsData.revenue}</h3>
            <p className="text-sm text-muted-foreground">Estimated monthly revenue</p>
            <p className="text-xs text-muted-foreground mt-6 text-center">
              This is based on featured deals, promotions, and estimated conversions.
              <br />Actual revenue may vary.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

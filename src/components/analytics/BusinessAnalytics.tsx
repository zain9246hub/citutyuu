import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MousePointer, Eye, Phone, Star, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

interface BusinessAnalyticsProps {
  businessId: string;
}

interface DealMetric {
  name: string;
  views: number;
  clicks: number;
  conversionRate: string;
}

// Weekly performance data for graphs
const weeklyData = [
  { day: 'Mon', views: 120, clicks: 45 },
  { day: 'Tue', views: 180, clicks: 72 },
  { day: 'Wed', views: 150, clicks: 58 },
  { day: 'Thu', views: 220, clicks: 89 },
  { day: 'Fri', views: 280, clicks: 112 },
  { day: 'Sat', views: 340, clicks: 135 },
  { day: 'Sun', views: 190, clicks: 68 },
];

const BusinessAnalytics = ({ businessId }: BusinessAnalyticsProps) => {
  // Mock data - in real app, fetch based on businessId
  const metrics = {
    totalClicks: 238,
    clicksChange: "+12%",
    profileViews: 1024,
    viewsChange: "+5%",
    phoneCalls: 45,
    callsChange: "-3%",
    savedDeals: 72,
    savedChange: "+15%"
  };

  const topDeals: DealMetric[] = [
    { name: "Summer Special Discount", views: 340, clicks: 85, conversionRate: "25%" },
    { name: "Weekend Flash Sale", views: 210, clicks: 62, conversionRate: "29%" },
    { name: "Holiday Package", views: 180, clicks: 51, conversionRate: "28%" },
    { name: "Loyalty Member Offer", views: 294, clicks: 40, conversionRate: "14%" }
  ];

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    positive = true,
    gradient = "from-blue-500 to-blue-600"
  }: {
    title: string;
    value: string | number;
    change: string;
    icon: any;
    positive?: boolean;
    gradient?: string;
  }) => (
    <Card className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
        <div className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} transform translate-x-8 -translate-y-8`} />
      </div>
      
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">{value}</div>
          <div className={`flex items-center text-xs font-semibold ${
            positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {positive ? (
              <TrendingUp className="h-3 w-3 mr-1" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1" />
            )}
            {change} from last month
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-1">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Business Analytics</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Total Clicks"
          value={metrics.totalClicks}
          change={metrics.clicksChange}
          icon={MousePointer}
          positive={true}
          gradient="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Profile Views"
          value={metrics.profileViews}
          change={metrics.viewsChange}
          icon={Eye}
          positive={true}
          gradient="from-emerald-500 to-emerald-600"
        />
        <MetricCard
          title="Phone Calls"
          value={metrics.phoneCalls}
          change={metrics.callsChange}
          icon={Phone}
          positive={false}
          gradient="from-orange-500 to-orange-600"
        />
        <MetricCard
          title="Saved Deals"
          value={metrics.savedDeals}
          change={metrics.savedChange}
          icon={Star}
          positive={true}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      <Tabs defaultValue="deals" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50 backdrop-blur-sm border border-border/50 shadow-sm">
          <TabsTrigger 
            value="deals" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all duration-200"
          >
            Top Deals
          </TabsTrigger>
          <TabsTrigger 
            value="revenue" 
            className="data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all duration-200"
          >
            Revenue
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="deals" className="space-y-4 mt-6">
          {/* Performance Graph */}
          <Card className="bg-gradient-to-br from-background via-background to-muted/20 border-border/50 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-foreground">Weekly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        color: 'hsl(var(--foreground))'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                      strokeWidth={2}
                      name="Views"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="clicks" 
                      stroke="hsl(142, 76%, 36%)" 
                      fillOpacity={1} 
                      fill="url(#colorClicks)" 
                      strokeWidth={2}
                      name="Clicks"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Views</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }} />
                  <span className="text-muted-foreground">Clicks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deal Table */}
          <Card className="bg-gradient-to-br from-background via-background to-muted/20 border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Top Deals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4 text-xs font-semibold text-muted-foreground border-b border-border/50 pb-3 uppercase tracking-wider">
                  <div>Deal Name</div>
                  <div className="text-center">Views</div>
                  <div className="text-center">Clicks</div>
                  <div className="text-center">Conv. Rate</div>
                </div>
                {topDeals.map((deal, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 text-sm items-center py-3 rounded-lg hover:bg-muted/30 transition-colors duration-200 px-2 -mx-2">
                    <div className="font-medium text-foreground truncate">{deal.name}</div>
                    <div className="text-center text-muted-foreground font-medium">{deal.views}</div>
                    <div className="text-center text-muted-foreground font-medium">{deal.clicks}</div>
                    <div className="text-center font-semibold text-primary">{deal.conversionRate}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-4 mt-6">
          <Card className="bg-gradient-to-br from-background via-background to-muted/20 border-border/50 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-muted-foreground/10 to-muted-foreground/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-8 w-8 text-muted-foreground/70" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Revenue Analytics</h3>
                <p className="text-muted-foreground">Detailed revenue insights coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessAnalytics;
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Eye, MousePointer } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";

type TimePeriod = "day" | "week" | "month" | "year";

// Mock data for different time periods
const getChartData = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return [
        { label: "6 AM", views: 12, clicks: 4 },
        { label: "9 AM", views: 45, clicks: 18 },
        { label: "12 PM", views: 78, clicks: 32 },
        { label: "3 PM", views: 95, clicks: 42 },
        { label: "6 PM", views: 120, clicks: 55 },
        { label: "9 PM", views: 85, clicks: 38 },
        { label: "12 AM", views: 30, clicks: 12 },
      ];
    case "week":
      return [
        { label: "Mon", views: 120, clicks: 45 },
        { label: "Tue", views: 180, clicks: 72 },
        { label: "Wed", views: 150, clicks: 58 },
        { label: "Thu", views: 220, clicks: 89 },
        { label: "Fri", views: 280, clicks: 112 },
        { label: "Sat", views: 340, clicks: 135 },
        { label: "Sun", views: 190, clicks: 68 },
      ];
    case "month":
      return [
        { label: "Week 1", views: 850, clicks: 340 },
        { label: "Week 2", views: 1120, clicks: 448 },
        { label: "Week 3", views: 980, clicks: 392 },
        { label: "Week 4", views: 1340, clicks: 536 },
      ];
    case "year":
      return [
        { label: "Jan", views: 3200, clicks: 1280 },
        { label: "Feb", views: 2800, clicks: 1120 },
        { label: "Mar", views: 3600, clicks: 1440 },
        { label: "Apr", views: 4100, clicks: 1640 },
        { label: "May", views: 3800, clicks: 1520 },
        { label: "Jun", views: 4500, clicks: 1800 },
        { label: "Jul", views: 5200, clicks: 2080 },
        { label: "Aug", views: 4800, clicks: 1920 },
        { label: "Sep", views: 4200, clicks: 1680 },
        { label: "Oct", views: 4600, clicks: 1840 },
        { label: "Nov", views: 5100, clicks: 2040 },
        { label: "Dec", views: 5800, clicks: 2320 },
      ];
    default:
      return [];
  }
};

const getDealStats = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return { views: 465, clicks: 201, conversion: "43%", change: "+8%" };
    case "week":
      return { views: 1480, clicks: 579, conversion: "39%", change: "+12%" };
    case "month":
      return { views: 4290, clicks: 1716, conversion: "40%", change: "+15%" };
    case "year":
      return { views: 52300, clicks: 20920, conversion: "40%", change: "+24%" };
    default:
      return { views: 0, clicks: 0, conversion: "0%", change: "0%" };
  }
};

const DealAnalytics = () => {
  const navigate = useNavigate();
  const { dealId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");

  const chartData = getChartData(selectedPeriod);
  const stats = getDealStats(selectedPeriod);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  // Get deal name from dealId (mock - in real app, fetch from API)
  const getDealName = (id: string | undefined) => {
    const deals: Record<string, string> = {
      "0": "Summer Special Discount",
      "1": "Weekend Flash Sale",
      "2": "Holiday Package",
      "3": "Loyalty Member Offer",
    };
    return deals[id || "0"] || "Deal Analytics";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-foreground truncate">
              {getDealName(dealId)}
            </h1>
            <p className="text-xs text-muted-foreground">Performance Analytics</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {/* Time Period Selector */}
        <div className="flex gap-2 bg-muted/50 p-1 rounded-xl">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedPeriod === period.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Total Views</span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.views.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.change}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Total Clicks</span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <MousePointer className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.clicks.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.change}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Rate Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium">Conversion Rate</span>
                <div className="text-3xl font-bold text-primary mt-1">{stats.conversion}</div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground">Change</span>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stats.change}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Chart */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Views & Clicks Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="analyticsViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="analyticsClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#analyticsViews)"
                    strokeWidth={2}
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(142, 76%, 36%)"
                    fillOpacity={1}
                    fill="url(#analyticsClicks)"
                    strokeWidth={2}
                    name="Clicks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground text-xs">Views</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }} />
                <span className="text-muted-foreground text-xs">Clicks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="label" 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Views" />
                  <Bar dataKey="clicks" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DealAnalytics;

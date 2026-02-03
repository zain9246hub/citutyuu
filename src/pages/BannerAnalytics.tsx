import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Eye, MousePointer, Image as ImageIcon, MapPin } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

type TimePeriod = "day" | "week" | "month" | "year";

const getChartData = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return [
        { label: "6 AM", views: 25, clicks: 8 },
        { label: "9 AM", views: 65, clicks: 22 },
        { label: "12 PM", views: 110, clicks: 45 },
        { label: "3 PM", views: 145, clicks: 58 },
        { label: "6 PM", views: 180, clicks: 72 },
        { label: "9 PM", views: 120, clicks: 48 },
        { label: "12 AM", views: 45, clicks: 15 },
      ];
    case "week":
      return [
        { label: "Mon", views: 320, clicks: 128 },
        { label: "Tue", views: 410, clicks: 164 },
        { label: "Wed", views: 380, clicks: 152 },
        { label: "Thu", views: 450, clicks: 180 },
        { label: "Fri", views: 520, clicks: 208 },
        { label: "Sat", views: 680, clicks: 272 },
        { label: "Sun", views: 420, clicks: 168 },
      ];
    case "month":
      return [
        { label: "Week 1", views: 1850, clicks: 740 },
        { label: "Week 2", views: 2320, clicks: 928 },
        { label: "Week 3", views: 2180, clicks: 872 },
        { label: "Week 4", views: 2640, clicks: 1056 },
      ];
    case "year":
      return [
        { label: "Jan", views: 8200, clicks: 3280 },
        { label: "Feb", views: 7400, clicks: 2960 },
        { label: "Mar", views: 9100, clicks: 3640 },
        { label: "Apr", views: 10500, clicks: 4200 },
        { label: "May", views: 9800, clicks: 3920 },
        { label: "Jun", views: 11200, clicks: 4480 },
        { label: "Jul", views: 12800, clicks: 5120 },
        { label: "Aug", views: 11900, clicks: 4760 },
        { label: "Sep", views: 10600, clicks: 4240 },
        { label: "Oct", views: 11400, clicks: 4560 },
        { label: "Nov", views: 12600, clicks: 5040 },
        { label: "Dec", views: 14200, clicks: 5680 },
      ];
    default:
      return [];
  }
};

const getBannerStats = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return { views: 690, clicks: 268, ctr: "38.8%", change: "+10%" };
    case "week":
      return { views: 3180, clicks: 1272, ctr: "40.0%", change: "+14%" };
    case "month":
      return { views: 8990, clicks: 3596, ctr: "40.0%", change: "+18%" };
    case "year":
      return { views: 121700, clicks: 48680, ctr: "40.0%", change: "+28%" };
    default:
      return { views: 0, clicks: 0, ctr: "0%", change: "0%" };
  }
};

const BannerAnalytics = () => {
  const navigate = useNavigate();
  const { bannerId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");

  const chartData = getChartData(selectedPeriod);
  const stats = getBannerStats(selectedPeriod);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const getBannerName = (id: string | undefined) => {
    return id ? `Banner ${id.substring(0, 8)}...` : "Banner Analytics";
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
              {getBannerName(bannerId)}
            </h1>
            <p className="text-xs text-muted-foreground">Banner Performance</p>
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
                <span className="text-xs text-muted-foreground font-medium">Total Impressions</span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
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

        {/* CTR Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground font-medium">Click-Through Rate (CTR)</span>
                <div className="text-3xl font-bold text-primary mt-1">{stats.ctr}</div>
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
              Impressions & Clicks Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="bannerViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bannerClicks" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#bannerViews)"
                    strokeWidth={2}
                    name="Impressions"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(142, 76%, 36%)"
                    fillOpacity={1}
                    fill="url(#bannerClicks)"
                    strokeWidth={2}
                    name="Clicks"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground text-xs">Impressions</span>
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
                  <Bar dataKey="views" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Impressions" />
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

export default BannerAnalytics;

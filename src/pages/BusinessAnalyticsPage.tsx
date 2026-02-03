import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, TrendingDown, Eye, MousePointer, Phone, Star, Building } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

type TimePeriod = "day" | "week" | "month" | "year";

const getChartData = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return [
        { label: "6 AM", views: 18, clicks: 6, calls: 1 },
        { label: "9 AM", views: 55, clicks: 20, calls: 4 },
        { label: "12 PM", views: 92, clicks: 35, calls: 8 },
        { label: "3 PM", views: 125, clicks: 48, calls: 10 },
        { label: "6 PM", views: 158, clicks: 62, calls: 14 },
        { label: "9 PM", views: 98, clicks: 38, calls: 8 },
        { label: "12 AM", views: 35, clicks: 12, calls: 2 },
      ];
    case "week":
      return [
        { label: "Mon", views: 280, clicks: 112, calls: 25 },
        { label: "Tue", views: 360, clicks: 144, calls: 32 },
        { label: "Wed", views: 320, clicks: 128, calls: 28 },
        { label: "Thu", views: 420, clicks: 168, calls: 38 },
        { label: "Fri", views: 480, clicks: 192, calls: 42 },
        { label: "Sat", views: 620, clicks: 248, calls: 55 },
        { label: "Sun", views: 380, clicks: 152, calls: 35 },
      ];
    case "month":
      return [
        { label: "Week 1", views: 1650, clicks: 660, calls: 145 },
        { label: "Week 2", views: 2080, clicks: 832, calls: 182 },
        { label: "Week 3", views: 1920, clicks: 768, calls: 168 },
        { label: "Week 4", views: 2350, clicks: 940, calls: 205 },
      ];
    case "year":
      return [
        { label: "Jan", views: 7200, clicks: 2880, calls: 630 },
        { label: "Feb", views: 6500, clicks: 2600, calls: 570 },
        { label: "Mar", views: 8100, clicks: 3240, calls: 710 },
        { label: "Apr", views: 9200, clicks: 3680, calls: 805 },
        { label: "May", views: 8600, clicks: 3440, calls: 750 },
        { label: "Jun", views: 9800, clicks: 3920, calls: 855 },
        { label: "Jul", views: 11200, clicks: 4480, calls: 980 },
        { label: "Aug", views: 10400, clicks: 4160, calls: 910 },
        { label: "Sep", views: 9400, clicks: 3760, calls: 820 },
        { label: "Oct", views: 10200, clicks: 4080, calls: 890 },
        { label: "Nov", views: 11100, clicks: 4440, calls: 970 },
        { label: "Dec", views: 12500, clicks: 5000, calls: 1090 },
      ];
    default:
      return [];
  }
};

const getBusinessStats = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return { views: 581, clicks: 221, calls: 47, rating: 4.5, change: "+8%" };
    case "week":
      return { views: 2860, clicks: 1144, calls: 255, rating: 4.5, change: "+12%" };
    case "month":
      return { views: 8000, clicks: 3200, calls: 700, rating: 4.5, change: "+16%" };
    case "year":
      return { views: 114200, clicks: 45680, calls: 9980, rating: 4.5, change: "+24%" };
    default:
      return { views: 0, clicks: 0, calls: 0, rating: 0, change: "0%" };
  }
};

const BusinessAnalyticsPage = () => {
  const navigate = useNavigate();
  const { businessId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");

  const chartData = getChartData(selectedPeriod);
  const stats = getBusinessStats(selectedPeriod);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  const getBusinessName = (id: string | undefined) => {
    // Try to get business name from localStorage
    try {
      const stored = localStorage.getItem('userBusinesses');
      if (stored) {
        const businesses = JSON.parse(stored);
        const business = businesses.find((b: any) => b.id === id);
        if (business) return business.name;
      }
    } catch (e) {
      console.error('Error loading business name:', e);
    }
    return id ? `Business ${id.substring(0, 8)}...` : "Business Analytics";
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
              {getBusinessName(businessId)}
            </h1>
            <p className="text-xs text-muted-foreground">Business Performance</p>
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
                <span className="text-xs text-muted-foreground font-medium">Profile Views</span>
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

          <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Phone Calls</span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Phone className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.calls.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.change}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-medium">Avg. Rating</span>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                  <Star className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground">{stats.rating}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1 font-medium">
                Based on reviews
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Area Chart */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Views & Engagement Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="businessViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="businessClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="businessCalls" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(24, 94%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(24, 94%, 50%)" stopOpacity={0} />
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
                    fill="url(#businessViews)"
                    strokeWidth={2}
                    name="Views"
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(142, 76%, 36%)"
                    fillOpacity={1}
                    fill="url(#businessClicks)"
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
                  <Bar dataKey="calls" fill="hsl(24, 94%, 50%)" radius={[4, 4, 0, 0]} name="Calls" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessAnalyticsPage;


import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Heart, MapPin, Phone, MessageCircle, Share2, Eye } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

type TimePeriod = "day" | "week" | "month" | "year";

const getReelChartData = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return [
        { label: "6 AM", likes: 5, locationTaps: 2, calls: 1, whatsapp: 3, shares: 2 },
        { label: "9 AM", likes: 18, locationTaps: 8, calls: 4, whatsapp: 10, shares: 6 },
        { label: "12 PM", likes: 32, locationTaps: 14, calls: 7, whatsapp: 18, shares: 12 },
        { label: "3 PM", likes: 42, locationTaps: 18, calls: 9, whatsapp: 22, shares: 15 },
        { label: "6 PM", likes: 55, locationTaps: 24, calls: 12, whatsapp: 30, shares: 20 },
        { label: "9 PM", likes: 38, locationTaps: 16, calls: 8, whatsapp: 20, shares: 14 },
        { label: "12 AM", likes: 12, locationTaps: 5, calls: 2, whatsapp: 6, shares: 4 },
      ];
    case "week":
      return [
        { label: "Mon", likes: 45, locationTaps: 18, calls: 9, whatsapp: 24, shares: 15 },
        { label: "Tue", likes: 72, locationTaps: 30, calls: 15, whatsapp: 38, shares: 24 },
        { label: "Wed", likes: 58, locationTaps: 24, calls: 12, whatsapp: 30, shares: 19 },
        { label: "Thu", likes: 89, locationTaps: 36, calls: 18, whatsapp: 46, shares: 29 },
        { label: "Fri", likes: 112, locationTaps: 48, calls: 24, whatsapp: 58, shares: 36 },
        { label: "Sat", likes: 135, locationTaps: 56, calls: 28, whatsapp: 70, shares: 45 },
        { label: "Sun", likes: 68, locationTaps: 28, calls: 14, whatsapp: 35, shares: 22 },
      ];
    case "month":
      return [
        { label: "Week 1", likes: 340, locationTaps: 140, calls: 70, whatsapp: 180, shares: 110 },
        { label: "Week 2", likes: 448, locationTaps: 185, calls: 92, whatsapp: 236, shares: 148 },
        { label: "Week 3", likes: 392, locationTaps: 162, calls: 81, whatsapp: 205, shares: 130 },
        { label: "Week 4", likes: 536, locationTaps: 220, calls: 110, whatsapp: 280, shares: 178 },
      ];
    case "year":
      return [
        { label: "Jan", likes: 1280, locationTaps: 530, calls: 260, whatsapp: 670, shares: 420 },
        { label: "Feb", likes: 1120, locationTaps: 460, calls: 230, whatsapp: 585, shares: 370 },
        { label: "Mar", likes: 1440, locationTaps: 595, calls: 300, whatsapp: 755, shares: 475 },
        { label: "Apr", likes: 1640, locationTaps: 675, calls: 340, whatsapp: 860, shares: 540 },
        { label: "May", likes: 1520, locationTaps: 625, calls: 315, whatsapp: 795, shares: 500 },
        { label: "Jun", likes: 1800, locationTaps: 740, calls: 370, whatsapp: 940, shares: 590 },
      ];
    default:
      return [];
  }
};

const getReelStats = (period: TimePeriod) => {
  switch (period) {
    case "day":
      return { likes: 202, locationTaps: 87, calls: 43, whatsapp: 109, shares: 73, change: "+8%" };
    case "week":
      return { likes: 579, locationTaps: 240, calls: 120, whatsapp: 301, shares: 190, change: "+12%" };
    case "month":
      return { likes: 1716, locationTaps: 707, calls: 353, whatsapp: 901, shares: 566, change: "+15%" };
    case "year":
      return { likes: 8800, locationTaps: 3625, calls: 1815, whatsapp: 4605, shares: 2895, change: "+24%" };
    default:
      return { likes: 0, locationTaps: 0, calls: 0, whatsapp: 0, shares: 0, change: "0%" };
  }
};

const ReelAnalytics = () => {
  const navigate = useNavigate();
  const { reelId } = useParams();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("week");

  const chartData = getReelChartData(selectedPeriod);
  const stats = getReelStats(selectedPeriod);

  const periods: { value: TimePeriod; label: string }[] = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  // Try to get reel name from localStorage
  const getReelName = (id: string | undefined) => {
    if (!id) return "Reel Analytics";
    try {
      const videoReels = JSON.parse(localStorage.getItem('videoReels') || '[]');
      const reel = videoReels.find((r: any) => r.id === id);
      if (reel) return reel.caption?.substring(0, 40) || "Video Reel";
    } catch {}
    return "Reel Analytics";
  };

  const statCards = [
    { label: "Likes", value: stats.likes, icon: Heart, color: "from-red-500 to-rose-600" },
    { label: "Location Taps", value: stats.locationTaps, icon: MapPin, color: "from-blue-500 to-blue-600" },
    { label: "Calls", value: stats.calls, icon: Phone, color: "from-green-500 to-emerald-600" },
    { label: "WhatsApp", value: stats.whatsapp, icon: MessageCircle, color: "from-emerald-500 to-green-600" },
    { label: "Shares", value: stats.shares, icon: Share2, color: "from-purple-500 to-indigo-600" },
  ];

  return (
    <div className="min-h-screen bg-background">
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
              {getReelName(reelId)}
            </h1>
            <p className="text-xs text-muted-foreground">Reel Performance Analytics</p>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className="bg-gradient-to-br from-background to-muted/20 border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value.toLocaleString()}</div>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stats.change}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Engagement Trend Chart */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Engagement Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reelLikes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="reelWhatsapp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="likes" stroke="hsl(0, 84%, 60%)" fillOpacity={1} fill="url(#reelLikes)" strokeWidth={2} name="Likes" />
                  <Area type="monotone" dataKey="whatsapp" stroke="hsl(142, 76%, 36%)" fillOpacity={1} fill="url(#reelWhatsapp)" strokeWidth={2} name="WhatsApp" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Interaction Breakdown */}
        <Card className="bg-gradient-to-br from-background to-muted/20 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Interaction Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="likes" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Likes" />
                  <Bar dataKey="locationTaps" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} name="Location" />
                  <Bar dataKey="calls" fill="hsl(142, 76%, 36%)" radius={[4, 4, 0, 0]} name="Calls" />
                  <Bar dataKey="whatsapp" fill="hsl(152, 69%, 31%)" radius={[4, 4, 0, 0]} name="WhatsApp" />
                  <Bar dataKey="shares" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} name="Shares" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReelAnalytics;

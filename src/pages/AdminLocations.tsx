import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Users, TrendingUp } from "lucide-react";
import { ALL_STATES, STATE_TO_CITIES } from "@/utils/indiaGeo";
import { useToast } from "@/hooks/use-toast";

// Demo data - In real app this would come from Supabase
const DEMO_LOCATION_STATUS = {
  states: {
    "Maharashtra": "approved",
    "Delhi": "approved", 
    "Karnataka": "coming-soon",
    "Tamil Nadu": "coming-soon",
    "Gujarat": "coming-soon",
    "Rajasthan": "coming-soon",
    "Uttar Pradesh": "coming-soon",
    "West Bengal": "coming-soon",
  },
  cities: {
    "Mumbai": "approved",
    "New Delhi": "approved",
    "Delhi": "approved", 
    "Pune": "approved",
    "Bangalore": "coming-soon",
    "Chennai": "coming-soon",
    "Ahmedabad": "coming-soon",
    "Jaipur": "coming-soon",
    "Lucknow": "coming-soon",
    "Kolkata": "coming-soon",
  }
};

// Demo interest data
const DEMO_INTEREST_DATA = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", city: "Bangalore", type: "user", date: "2024-01-15" },
  { id: 2, name: "Tech Solutions Pvt Ltd", email: "contact@techsol.com", city: "Chennai", type: "business", date: "2024-01-14" },
  { id: 3, name: "Priya Patel", email: "priya@example.com", city: "Ahmedabad", type: "user", date: "2024-01-12" },
  { id: 4, name: "Food Corner Restaurant", email: "info@foodcorner.com", city: "Jaipur", type: "business", date: "2024-01-10" },
];

const AdminLocations = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationStatus, setLocationStatus] = useState(DEMO_LOCATION_STATUS);

  const handleToggleStatus = (type: 'states' | 'cities', location: string) => {
    const currentStatus = locationStatus[type][location] || "coming-soon";
    const newStatus = currentStatus === "approved" ? "coming-soon" : "approved";
    
    setLocationStatus(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [location]: newStatus
      }
    }));

    toast({
      title: "Status Updated",
      description: `${location} is now ${newStatus === "approved" ? "approved" : "coming soon"}`,
    });
  };

  const filteredStates = ALL_STATES.filter(state =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCities = Object.keys(STATE_TO_CITIES).flatMap(state => 
    STATE_TO_CITIES[state] || []
  ).filter(city =>
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    return status === "approved" ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Approved
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
        Coming Soon
      </Badge>
    );
  };

  const approvedStatesCount = Object.values(locationStatus.states).filter(s => s === "approved").length;
  const approvedCitiesCount = Object.values(locationStatus.cities).filter(s => s === "approved").length;
  const totalInterest = DEMO_INTEREST_DATA.length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Location Management</h1>
          <p className="text-muted-foreground">Manage states and cities availability</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center p-6">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved States</p>
                <p className="text-2xl font-bold">{approvedStatesCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <MapPin className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Cities</p>
                <p className="text-2xl font-bold">{approvedCitiesCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Launch Requests</p>
                <p className="text-2xl font-bold">{totalInterest}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <TrendingUp className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
                <p className="text-2xl font-bold">+24%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search states or cities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="states" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="states">States</TabsTrigger>
            <TabsTrigger value="cities">Cities</TabsTrigger>
            <TabsTrigger value="interest">Launch Interest</TabsTrigger>
          </TabsList>

          <TabsContent value="states" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>State Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStates.map((state) => {
                    const status = locationStatus.states[state] || "coming-soon";
                    return (
                      <div key={state} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{state}</p>
                            {getStatusBadge(status)}
                          </div>
                        </div>
                        <Switch
                          checked={status === "approved"}
                          onCheckedChange={() => handleToggleStatus('states', state)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cities" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>City Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCities.slice(0, 50).map((city) => {
                    const status = locationStatus.cities[city] || "coming-soon";
                    return (
                      <div key={city} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{city}</p>
                            {getStatusBadge(status)}
                          </div>
                        </div>
                        <Switch
                          checked={status === "approved"}
                          onCheckedChange={() => handleToggleStatus('cities', city)}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interest" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Launch Interest Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEMO_INTEREST_DATA.map((interest) => (
                    <div key={interest.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {interest.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{interest.name}</p>
                          <p className="text-sm text-muted-foreground">{interest.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{interest.city}</Badge>
                            <Badge variant={interest.type === "business" ? "default" : "secondary"}>
                              {interest.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">{interest.date}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Contact
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminLocations;
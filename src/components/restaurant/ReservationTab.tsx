
import React from "react";
import { Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ReservationTabProps {
  bookingDate: string;
  setBookingDate: (date: string) => void;
  bookingTime: string;
  setBookingTime: (time: string) => void;
  bookingGuests: string;
  setBookingGuests: (guests: string) => void;
  handlePhoneClick: () => void;
}

const ReservationTab = ({
  bookingDate,
  setBookingDate,
  bookingTime,
  setBookingTime,
  bookingGuests,
  setBookingGuests,
  handlePhoneClick
}: ReservationTabProps) => {
  const { toast } = useToast();

  const handleBookTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time for your reservation",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Reservation Confirmed!",
      description: `Your table for ${bookingGuests} guests on ${bookingDate} at ${bookingTime} has been reserved.`,
    });
    
    // Reset form
    setBookingDate("");
    setBookingTime("");
    setBookingGuests("2");
  };

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Reserve Your Table</h3>
        <p className="text-sm text-gray-600 mb-4">
          Secure your spot at Café Milano. Book now to experience our signature Italian cuisine.
        </p>
        
        <form onSubmit={handleBookTable}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input 
                type="date" 
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <select 
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Time</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="1:00 PM">1:00 PM</option>
                <option value="1:30 PM">1:30 PM</option>
                <option value="7:00 PM">7:00 PM</option>
                <option value="7:30 PM">7:30 PM</option>
                <option value="8:00 PM">8:00 PM</option>
                <option value="8:30 PM">8:30 PM</option>
                <option value="9:00 PM">9:00 PM</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Guests
              </label>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <select 
                  value={bookingGuests}
                  onChange={(e) => setBookingGuests(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6">6 people</option>
                  <option value="7+">7+ people</option>
                </select>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 font-medium py-2">
              Reserve Table
            </Button>
          </div>
        </form>
      </div>
      
      <div className="rounded-lg border p-4 mb-4">
        <h4 className="font-medium mb-2">Special Requests</h4>
        <p className="text-sm text-gray-600 mb-3">
          For special arrangements such as birthday celebrations or dietary requirements, please call us directly.
        </p>
        <Button variant="outline" className="w-full" onClick={handlePhoneClick}>
          <Phone className="h-4 w-4 mr-2" />
          Call Restaurant
        </Button>
      </div>
    </>
  );
};

export default ReservationTab;

// Centralized India states and cities dataset
// Focused but extensible mapping. Add/extend as needed.

export const ALL_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
] as const;

export const STATES_WITH_ALL = ["All States", ...ALL_STATES] as const;

export const STATE_TO_CITIES: Record<string, readonly string[]> = {
  // Andhra Pradesh
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati",
    "Kakinada", "Rajahmundry", "Anantapur", "Eluru", "Kadapa", "Ongole",
    "Srikakulam", "Machilipatnam", "Proddatur", "Chittoor", "Nandyal",
  ],
  // Arunachal Pradesh
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro"],
  // Assam
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon", "Tinsukia"],
  // Bihar
  "Bihar": [
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga",
    "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra",
    "Saharsa", "Hajipur", "Siwan", "Bettiah", "Motihari", "Jehanabad",
    "Buxar",
  ],
  // Chhattisgarh
  "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Bhilai", "Korba", "Rajnandgaon"],
  // Goa
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  // Gujarat
  "Gujarat": [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar",
    "Gandhinagar", "Junagadh", "Nadiad", "Bharuch", "Anand", "Morbi",
    "Gandhidham", "Porbandar",
  ],
  // Haryana
  "Haryana": [
    "Gurgaon", "Faridabad", "Panipat", "Karnal", "Sonipat", "Yamunanagar",
    "Hisar", "Rohtak", "Panchkula", "Ambala",
  ],
  // Himachal Pradesh
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu"],
  // Jharkhand
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribagh", "Bokaro"],
  // Karnataka
  "Karnataka": [
    "Bangalore", "Mysore", "Hubli-Dharwad", "Mangalore", "Belgaum", "Ballari",
    "Shivamogga", "Tumkur", "Davangere", "Udupi",
  ],
  // Kerala
  "Kerala": [
    "Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Alappuzha",
    "Kollam", "Kottayam",
  ],
  // Madhya Pradesh
  "Madhya Pradesh": [
    "Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Satna", "Sagar",
    "Ratlam", "Rewa",
  ],
  // Maharashtra
  "Maharashtra": [
    "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur",
    "Navi Mumbai", "Amravati", "Jalgaon", "Kolhapur",
  ],
  // Manipur
  "Manipur": ["Imphal", "Thoubal", "Kakching"],
  // Meghalaya
  "Meghalaya": ["Shillong", "Tura", "Jowai"],
  // Mizoram
  "Mizoram": ["Aizawl", "Lunglei"],
  // Nagaland
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung"],
  // Odisha
  "Odisha": [
    "Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Balasore",
  ],
  // Punjab
  "Punjab": [
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali",
  ],
  // Rajasthan
  "Rajasthan": [
    "Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Alwar",
    "Bhilwara", "Sikar", "Sri Ganganagar",
  ],
  // Sikkim
  "Sikkim": ["Gangtok", "Gyalshing", "Namchi"],
  // Tamil Nadu
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirapalli", "Tirunelveli",
    "Salem", "Erode", "Tiruppur", "Vellore", "Kanchipuram", "Thanjavur",
  ],
  // Telangana
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Suryapet",
    "Ramagundam",
  ],
  // Tripura
  "Tripura": ["Agartala", "Udaipur"],
  // Uttar Pradesh
  "Uttar Pradesh": [
    "Lucknow", "Kanpur", "Noida", "Ghaziabad", "Agra", "Varanasi", "Meerut",
    "Prayagraj", "Bareilly", "Aligarh", "Moradabad", "Saharanpur", "Gorakhpur",
    "Jhansi",
  ],
  // Uttarakhand
  "Uttarakhand": ["Dehradun", "Haridwar", "Haldwani", "Rudrapur", "Rishikesh"],
  // West Bengal
  "West Bengal": [
    "Kolkata", "Howrah", "Asansol", "Durgapur", "Siliguri", "Bardhaman",
    "Kharagpur", "Bhatpara", "Panihati",
  ],
  // Union Territories
  "Andaman and Nicobar Islands": ["Port Blair"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Daman", "Diu", "Silvassa"],
  "Delhi": ["New Delhi", "Delhi"],
  "Jammu and Kashmir": ["Srinagar", "Jammu"],
  "Ladakh": ["Leh", "Kargil"],
  "Lakshadweep": ["Kavaratti"],
  "Puducherry": ["Pondicherry", "Karaikal", "Ozhukarai"],
} as const;

export const ALL_CITIES = Array.from(
  new Set(
    Object.values(STATE_TO_CITIES)
      .flat()
      .map((c) => c.trim())
  )
).sort();

export const CITIES_WITH_ALL = ["All Cities", ...ALL_CITIES] as const;

export const getCitiesForState = (state: string | null | undefined): readonly string[] => {
  if (!state || state === "All States") return ALL_CITIES;
  return STATE_TO_CITIES[state] ?? [];
};

export interface SlotBanner {
  id: string;
  position: number;
  adContent: string;
  location: string;
  backgroundColor: string;
  demoVideoUrl?: string;
  imageUrl?: string;
  isBooked?: boolean;
  title?: string;
  description?: string;
  businessName?: string;
  targetUrl?: string;
  price?: number;
  isUploadedAd?: boolean;
  videoUrl?: string;
  businessId?: string;
}

export interface SlotCarouselProps {
  position: number;
  totalSlots?: number;
  bookedSlots?: number;
  onViewAll?: () => void;
  showViewAll?: boolean;
  showBookButton?: boolean;
  onBook?: (e: React.MouseEvent) => void;
  onBookSuccess?: () => void;
  autoPlay?: boolean;
  interval?: number;
  paginationEnabled?: boolean;
  itemsPerPage?: number;
  selectedCity?: string | null;
  maxVisible?: number;
  rotationIndex?: number;
}

export interface SlotBannerCardProps {
  slide: SlotBanner;
  timeRemaining?: number;
  onClick: (banner: SlotBanner) => void;
  onBook?: (e: React.MouseEvent) => void;
  showBookButton?: boolean;
}

export interface SlotCarouselViewProps {
  slides: SlotBanner[];
  timeRemaining?: number;
  onViewAll?: () => void;
  showViewAll?: boolean;
  onBannerClick: (banner: SlotBanner) => void;
  onBook?: (e: React.MouseEvent) => void;
  showBookButton?: boolean;
  api?: any;
  setApi?: (api: any) => void;
  autoPlay?: boolean;
  interval?: number;
  autoplayPlugin?: any;
  paginationEnabled?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  maxVisible?: number;
}

export interface BannerPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  banner: SlotBanner | null;
  timeRemaining?: number;
  onBook?: (e: React.MouseEvent) => void;
  showBookButton?: boolean;
  onViewFullBanner?: () => void;
  onVisitBusiness?: () => void;
  isExplorer?: boolean;
}

export interface SlotBookingFormProps {
  open: boolean;
  onClose: () => void;
  slotId: string;
  location: string;
  onSuccess?: () => void;
}

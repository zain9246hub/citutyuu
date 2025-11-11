import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ExternalLink, Store } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import BusinessEditDialog from '@/components/business/BusinessEditDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProductService {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  city: string;
  state: string;
  phone: string;
  email?: string;
  website?: string;
  priceRange: string;
  images: string[];
  rating: number;
  reviewCount: number;
  isUserSubmitted?: boolean;
  features?: string[];
  hours?: Array<{ day: string; open: string; close: string; isOpen: boolean }>;
  products?: ProductService[];
  services?: ProductService[];
}

const ManageBusinesses: React.FC = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [deletingBusinessId, setDeletingBusinessId] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);

  // Load businesses from localStorage
  const loadBusinesses = () => {
    try {
      const stored = localStorage.getItem('userBusinesses');
      if (stored) {
        const parsed = JSON.parse(stored);
        setBusinesses(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading businesses:', error);
    }
  };

  React.useEffect(() => {
    loadBusinesses();

    // Listen for business updates
    const handleStorageChange = () => {
      loadBusinesses();
    };

    window.addEventListener('businessUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('businessUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
  };

  const handleSave = (updatedBusiness: Business) => {
    try {
      const stored = localStorage.getItem('userBusinesses');
      let allBusinesses: Business[] = stored ? JSON.parse(stored) : [];
      
      // Update the business
      allBusinesses = allBusinesses.map(b => 
        b.id === updatedBusiness.id ? updatedBusiness : b
      );
      
      localStorage.setItem('userBusinesses', JSON.stringify(allBusinesses));
      setBusinesses(allBusinesses);
      
      toast({
        title: "Business Updated",
        description: "Your business has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update business",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (businessId: string) => {
    try {
      const stored = localStorage.getItem('userBusinesses');
      let allBusinesses: Business[] = stored ? JSON.parse(stored) : [];
      
      // Remove the business
      allBusinesses = allBusinesses.filter(b => b.id !== businessId);
      
      localStorage.setItem('userBusinesses', JSON.stringify(allBusinesses));
      setBusinesses(allBusinesses);
      setDeletingBusinessId(null);
      
      toast({
        title: "Business Deleted",
        description: "Your business has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business",
        variant: "destructive",
      });
    }
  };

  const handleView = (businessId: string) => {
    navigate(`/business/${businessId}`);
  };

  if (businesses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Businesses</CardTitle>
          <CardDescription>Manage your business listings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Store className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Businesses Yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't added any business listings yet
            </p>
            <Button onClick={() => navigate('/business-upload')}>
              Add Your First Business
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>My Businesses</CardTitle>
          <CardDescription>
            Manage and edit your business listings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {businesses.map((business) => (
              <div
                key={business.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Business Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={business.images[0] || '/placeholder.svg'}
                      alt={business.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </div>

                  {/* Business Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg truncate">
                          {business.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{business.category}</Badge>
                          <span>{business.priceRange}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {business.description}
                    </p>

                    <p className="text-sm text-muted-foreground mb-3">
                      📍 {business.city}, {business.state}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleView(business.id)}
                        className="gap-2"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(business)}
                        className="gap-2"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingBusinessId(business.id)}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingBusiness && (
        <BusinessEditDialog
          open={!!editingBusiness}
          onOpenChange={(open) => !open && setEditingBusiness(null)}
          business={editingBusiness}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingBusinessId} onOpenChange={(open) => !open && setDeletingBusinessId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Business</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this business? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingBusinessId && handleDelete(deletingBusinessId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageBusinesses;

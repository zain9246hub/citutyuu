
import React, { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ReelUploadDialogProps {
  open: boolean;
  videoUrl: string | null;
  isUploading: boolean;
  onSubmit: (caption: string, directionsUrl?: string, phoneNumber?: string) => void;
  onCancel: () => void;
}

const ReelUploadDialog = ({ 
  open, 
  videoUrl, 
  isUploading, 
  onSubmit, 
  onCancel 
}: ReelUploadDialogProps) => {
  const [caption, setCaption] = useState("");
  const [directionsUrl, setDirectionsUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = () => {
    onSubmit(caption, directionsUrl, phoneNumber);
    resetForm();
  };

  const handleCancel = () => {
    onCancel();
    resetForm();
  };

  const resetForm = () => {
    setCaption("");
    setDirectionsUrl("");
    setPhoneNumber("");
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className="sm:max-w-md mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Upload new reel</DialogTitle>
          <DialogDescription>Add details about your business location</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {videoUrl && (
            <div className="relative bg-black rounded-md overflow-hidden aspect-[9/16] max-h-[200px] sm:max-h-[250px] flex-shrink-0">
              <video 
                src={videoUrl} 
                className="w-full h-full object-contain" 
                controls
                autoPlay
                muted
                loop
              />
            </div>
          )}
          
          <div className="grid w-full gap-2">
            <Textarea
              placeholder="Write a caption for your reel..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              disabled={isUploading}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <div className="grid w-full gap-2">
            <Label htmlFor="directions">Directions URL (Google Maps)</Label>
            <Input
              id="directions"
              placeholder="https://maps.google.com/..."
              value={directionsUrl}
              onChange={(e) => setDirectionsUrl(e.target.value)}
              disabled={isUploading}
            />
          </div>
          
          <div className="grid w-full gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="+1 234 567 8900"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isUploading}
            />
          </div>
        </div>
        
        <DialogFooter className="flex-shrink-0 sm:justify-between gap-2">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="button" 
            onClick={handleSubmit}
            disabled={isUploading}
            className="relative"
          >
            {isUploading ? (
              <>
                <LoaderCircle className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : "Post Reel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReelUploadDialog;

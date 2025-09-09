
import React from "react";
import { Plus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReelsHeaderProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  showUploadButton?: boolean;
}

const ReelsHeader = ({ onUpload, fileInputRef, isUploading, showUploadButton = true }: ReelsHeaderProps) => {
  return (
    <>
      <input
        type="file"
        accept="video/*"
        className="hidden"
        ref={fileInputRef}
        onChange={onUpload}
        disabled={isUploading}
      />
      {showUploadButton && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          variant="ghost"
          size="icon"
          className="rounded-full bg-black/40 hover:bg-black/60 pointer-events-auto"
          disabled={isUploading}
        >
          {isUploading ? (
            <LoaderCircle className="h-5 w-5 text-white animate-spin" />
          ) : (
            <Plus className="h-5 w-5 text-white" />
          )}
        </Button>
      )}
    </>
  );
};

export default ReelsHeader;

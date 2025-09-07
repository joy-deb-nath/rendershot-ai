import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Download, X, Image as ImageIcon } from "lucide-react";
import ImageUploader from "./ImageUploader";

// Helper function to convert File to base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Helper to fetch an image URL (including bundled assets) and return a data URL and File
const fetchImageAsDataUrl = async (imageUrl: string): Promise<{ dataUrl: string; file: File } | null> => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const mimeType = blob.type || "image/jpeg";
    const arrayBuffer = await blob.arrayBuffer();
    const base64String = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const dataUrl = `data:${mimeType};base64,${base64String}`;
    const fileName = imageUrl.split('/').pop() || `demo-${Date.now()}.jpg`;
    const file = new File([blob], fileName, { type: mimeType });
    return { dataUrl, file };
  } catch (error) {
    console.error('Failed to fetch demo image:', error);
    return null;
  }
};

interface CanvasProps {
  onImageUpload: (base64DataUrl: string, file: File) => void;
  onImageSelect: (imageUrl: string) => void;
  onClearCanvas: () => void;
  currentImage?: string;
  isGenerating?: boolean;
}

const Canvas = ({ 
  onImageUpload, 
  onImageSelect, 
  onClearCanvas, 
  currentImage,
  isGenerating = false 
}: CanvasProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = async (file: File) => {
    if (file.type.startsWith('image/')) {
      try {
        const base64DataUrl = await fileToBase64(file);
        onImageUpload(base64DataUrl, file);
      } catch (error) {
        console.error('Failed to convert file to base64:', error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage;
      link.download = `rendercam-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDemoImageSelect = async (imageUrl: string) => {
    const result = await fetchImageAsDataUrl(imageUrl);
    if (result) {
      onImageUpload(result.dataUrl, result.file);
    } else {
      // Fallback: still display the URL if conversion failed
      onImageSelect(imageUrl);
    }
  };

  return (
    <div>
      {/* Main Canvas - 1:1 Aspect Ratio */}
      <Card className="border-border/40">
        <CardContent className="p-6">
          <div className="aspect-square w-full max-w-lg mx-auto">
            {!currentImage ? (
              // State 1: Empty Canvas with Upload Interface
              <div
                className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upload Product Image
                </h3>
                <p className="text-muted-foreground mb-6 text-center">
                  Drag and drop your image here, or click to browse
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                  id="canvas-file-upload"
                />
                <label htmlFor="canvas-file-upload">
                  <Button variant="outline" asChild className="cursor-pointer">
                    <span>Choose File</span>
                  </Button>
                </label>
                
                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">or select from</p>
                  <ImageUploader onImageSelect={handleDemoImageSelect} />
                </div>
              </div>
            ) : (
              // State 2: Image Loaded with Controls
              <div className="relative w-full h-full group">
                <img
                  src={currentImage}
                  alt="Canvas image"
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {/* Canvas Controls Overlay */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur"
                    onClick={handleDownload}
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-background/80 backdrop-blur"
                    onClick={onClearCanvas}
                    title="Clear canvas"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Loading Overlay */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Canvas;

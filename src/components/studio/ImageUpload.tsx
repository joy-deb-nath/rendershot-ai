import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import demoProduct1 from "@/assets/demo-product-1.jpg";
import demoProduct2 from "@/assets/demo-product-2.jpg";
import demoProduct3 from "@/assets/demo-product-3.jpg";

// Helper function to convert File to base64 data URL
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface ImageUploadProps {
  onImageUpload: (base64DataUrl: string, file: File) => void;
  uploadedImage?: string;
}

const ImageUpload = ({ onImageUpload, uploadedImage }: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(uploadedImage || null);

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
        setPreviewUrl(base64DataUrl);
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

  const clearImage = () => {
    setPreviewUrl(null);
    // No need to revoke base64 URLs like we did with blob URLs
  };

  const demoImages = [
    { id: 1, url: demoProduct1, alt: "Demo Product 1" },
    { id: 2, url: demoProduct2, alt: "Demo Product 2" },
    { id: 3, url: demoProduct3, alt: "Demo Product 3" }
  ];

  return (
    <div className="space-y-6">
      <Card className="border-border/40">
        <CardContent className="p-6">
          {!previewUrl ? (
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive 
                  ? "border-primary bg-primary/5" 
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upload Product Image
              </h3>
              <p className="text-muted-foreground mb-6">
                Drag and drop your image here, or click to browse
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" asChild className="cursor-pointer">
                  <span>Choose File</span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Uploaded product"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 backdrop-blur"
                onClick={clearImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!previewUrl && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground">or select from</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {demoImages.map((demo) => (
              <Card 
                key={demo.id} 
                className="cursor-pointer hover:shadow-card transition-all border-border/40"
                onClick={() => setPreviewUrl(demo.url)}
              >
                <CardContent className="p-3">
                  <div className="w-full h-20 bg-muted rounded overflow-hidden">
                    <img src={demo.url} alt={demo.alt} className="w-full h-full object-cover" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
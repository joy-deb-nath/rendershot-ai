import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Heart, Share2 } from "lucide-react";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  aspectRatio: string;
}

interface GeneratedImagesProps {
  sourceImage?: string;
  generatedImages: GeneratedImage[];
  isGenerating?: boolean;
}

const GeneratedImages = ({ sourceImage, generatedImages, isGenerating }: GeneratedImagesProps) => {
  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="space-y-6 p-6 border-t border-border/40">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground">Results</h3>
        <p className="text-sm text-muted-foreground">Compare your source image with generated results</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {/* Source Image */}
        {sourceImage && (
          <div className="flex-shrink-0 space-y-3">
            <Card className="w-64 border-border/40">
              <CardContent className="p-4">
                <img
                  src={sourceImage}
                  alt="Source image"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </CardContent>
            </Card>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Source Image</p>
            </div>
          </div>
        )}

        {/* Generated Images */}
        {generatedImages.map((image, index) => (
          <div key={image.id} className="flex-shrink-0 space-y-3">
            <Card className="w-64 border-border/40 hover:shadow-card transition-all">
              <CardContent className="p-4">
                <div className="relative group">
                  <img
                    src={image.url}
                    alt={`Generated image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  {/* Action Overlay */}
                   <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleDownload(image.url, index)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">Generated Image {index + 1}</p>
              <p className="text-xs text-muted-foreground">{image.aspectRatio}</p>
            </div>
          </div>
        ))}

        {/* Loading State */}
        {isGenerating && (
          <div className="flex-shrink-0 space-y-3">
            <Card className="w-64 border-border/40">
              <CardContent className="p-4">
                <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              </CardContent>
            </Card>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Generating...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isGenerating && generatedImages.length === 0 && (
          <div className="flex-shrink-0 space-y-3">
            <Card className="w-64 border-border/40 border-dashed">
              <CardContent className="p-4">
                <div className="w-full h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-center">
                    Generated images will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratedImages;
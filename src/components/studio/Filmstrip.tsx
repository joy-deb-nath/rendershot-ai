import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";

interface FilmstripImage {
  id: string;
  url: string;
  prompt?: string;
  isSource?: boolean;
}

interface FilmstripProps {
  images: FilmstripImage[];
  activeImageId?: string;
  onImageSelect: (imageUrl: string) => void;
  isGenerating?: boolean;
  orientation?: 'horizontal' | 'vertical';
  verticalFitCount?: number; // when vertical, number of items to fit in column height
}

const Filmstrip = ({ images, activeImageId, onImageSelect, isGenerating = false, orientation = 'horizontal', verticalFitCount }: FilmstripProps) => {
  // Always show filmstrip if there are images or if it's generating
  if (images.length === 0 && !isGenerating) {
    return null;
  }

  const isVertical = orientation === 'vertical';

  return (
    <div className={isVertical ? "space-x-1 h-full" : "space-y-1"}>
      <div className={`flex ${isVertical ? 'flex-col overflow-y-auto pr-2 h-full max-h-full gap-2' : 'overflow-x-auto pb-2 gap-3'}`}>
        {images.map((image, index) => (
          <Card 
            key={image.id} 
            className={`cursor-pointer hover:shadow-card transition-all border-2 flex-shrink-0 ${
              isVertical 
                ? "w-full" 
                : "w-20 h-20"
            } ${
              activeImageId === image.id 
                ? "border-primary shadow-md" 
                : "border-border/40 hover:border-primary/50"
            }`}
            onClick={() => onImageSelect(image.url)}
            style={isVertical && verticalFitCount ? { height: `${100 / verticalFitCount}%` } : undefined}
          >
            <CardContent className="p-1 w-full h-full">
              <div className="relative w-full h-full">
                <img
                  src={image.url}
                  alt={image.prompt || `Image ${index + 1}`}
                  className="w-full h-full object-cover rounded"
                />
                
                {/* Source Image Badge */}
                {image.isSource && (
                  <div className="absolute top-1 left-1">
                    <Badge variant="default" className="text-xs px-1 py-0">
                      Source
                    </Badge>
                  </div>
                )}
                
                {/* Active Indicator */}
                {activeImageId === image.id && (
                  <div className="absolute inset-0 border-2 border-primary rounded bg-primary/10"></div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Generating Placeholder */}
        {isGenerating && (
          <Card className={`border-dashed border-2 border-primary/50 flex-shrink-0 ${
            isVertical ? "w-full" : "w-20 h-20"
          }`} style={isVertical && verticalFitCount ? { height: `${100 / verticalFitCount}%` } : undefined}>
            <CardContent className="p-1 w-full h-full">
              <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Filmstrip;

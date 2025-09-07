import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import demoProduct1 from "@/assets/demo-product-1.jpg";
import demoProduct2 from "@/assets/demo-product-2.jpg";
import demoProduct3 from "@/assets/demo-product-3.jpg";

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
}

const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  const demoImages = [
    { id: 1, url: demoProduct1, alt: "Demo Product 1" },
    { id: 2, url: demoProduct2, alt: "Demo Product 2" },
    { id: 3, url: demoProduct3, alt: "Demo Product 3" }
  ];

  return (
    <div className="flex gap-2 justify-center">
      {demoImages.map((demo) => (
        <Card 
          key={demo.id} 
          className="cursor-pointer hover:shadow-card transition-all border-border/40 w-16 h-16"
          onClick={() => onImageSelect(demo.url)}
        >
          <CardContent className="p-2 w-full h-full">
            <div className="w-full h-full bg-muted rounded flex items-center justify-center overflow-hidden">
              <img src={demo.url} alt={demo.alt} className="w-full h-full object-cover" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImageUploader;


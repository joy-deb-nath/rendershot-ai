import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnhancedButton } from "@/components/ui/button-variants";
import ImageUpload from "@/components/studio/ImageUpload";
import GeneratedImages from "@/components/studio/GeneratedImages";

interface TemplateConfig {
  title: string;
  description: string;
  prompt: string;
}

const templates: Record<string, TemplateConfig> = {
  "template-1": {
    title: "Minimalist Studio",
    description: "Clean white background with professional lighting perfect for product catalogs",
    prompt: "Professional product photography with clean white seamless background, studio lighting, minimal shadows, catalog style"
  },
  "template-2": {
    title: "Lifestyle Context", 
    description: "Natural home environment with warm lighting for lifestyle marketing",
    prompt: "Lifestyle product photography in modern home setting, warm natural lighting, cozy atmosphere, authentic placement"
  },
  "template-3": {
    title: "Editorial Fashion",
    description: "High-end magazine style with dramatic shadows and premium feel",
    prompt: "Editorial fashion photography style, dramatic lighting, high contrast shadows, luxury premium aesthetic, magazine quality"
  },
  "template-4": {
    title: "E-commerce Hero",
    description: "Perfect for product listings and catalogs with optimal lighting",
    prompt: "E-commerce hero shot, perfect lighting, neutral background, product focused, commercial photography style"
  }
};

const TemplateBase = () => {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const template = templateId ? templates[templateId] : null;

  const handleImageUpload = (base64DataUrl: string, file: File) => {
    setUploadedImage(base64DataUrl);
  };

  const handleGenerate = async () => {
    if (!uploadedImage || !template) return;

    setIsGenerating(true);
    
    // Simulate generation process with template-specific prompt
    setTimeout(() => {
      const newImage = {
        id: Date.now().toString(),
        url: uploadedImage,
        prompt: template.prompt,
        aspectRatio: "square"
      };
      setGeneratedImages([...generatedImages, newImage]);
      setIsGenerating(false);
    }, 3000);
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Template Not Found</h1>
          <Button onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border/40 p-6">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">RenderCam AI</span>
          </div>

          {/* Back to Dashboard */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="w-full justify-start"
          >
            <ArrowLeft className="h-4 w-4 mr-3" />
            Dashboard
          </Button>

          {/* Template Info */}
          <div className="space-y-4">
            <div className="text-sm font-medium text-muted-foreground">TEMPLATE</div>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">{template.title}</h3>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </div>

          {/* Features Navigation */}
          <nav className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-4">FEATURES</div>
            <div className="space-y-1">
              <button
                onClick={() => navigate('/dashboard/virtual-photoshoot')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
              >
                <span className="text-sm text-muted-foreground">Virtual Photoshoot</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/virtual-models')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
              >
                <span className="text-sm text-muted-foreground">Virtual Models</span>
              </button>
              <button
                onClick={() => navigate('/dashboard/ugc-style')}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
              >
                <span className="text-sm text-muted-foreground">UGC-Style Shots</span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Dashboard / {template.title}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>

          {/* Upload Area */}
          <ImageUpload 
            onImageUpload={handleImageUpload}
            uploadedImage={uploadedImage || undefined}
          />

          {/* Generate Button */}
          {uploadedImage && (
            <div className="flex justify-center">
              <EnhancedButton 
                variant="hero" 
                size="hero"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="min-w-64"
              >
                {isGenerating ? "Generating..." : "Generate Image"}
              </EnhancedButton>
            </div>
          )}

          {/* Generated Images */}
          <GeneratedImages 
            sourceImage={uploadedImage || undefined}
            generatedImages={generatedImages}
            isGenerating={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};

export default TemplateBase;
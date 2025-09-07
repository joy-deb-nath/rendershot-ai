import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera, Users, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/studio/Canvas";
import Filmstrip from "@/components/studio/Filmstrip";
import { generateStudioImage, generateTemplateImage, isGeminiInitialized } from "@/services/geminiService";
import { toast } from "sonner";

interface TemplateConfig {
  title: string;
  description: string;
  prompt: string;
}

const templates: Record<string, TemplateConfig> = {
  "ad-poster": {
    title: "Ad Poster",
    description: "Premium ad poster with dramatic lighting and polished Photoshop compositing.",
    prompt: "Make this product in the picture into an ad poster that is super-premium, dramatic lighting, creative, photoshop manipulation style"
  },
  "miniature-on-desk": {
    title: "Miniature on Desk",
    description: "Realistic 1/7‑scale miniature on a desk with modeling screen and packaging.",
    prompt: "Create a 1/7 scale commercialized miniature version of the product in the picture, in a realistic style, in a real environment. The miniature is placed on a computer desk. The miniature has a round transparent acrylic base, with no text on the base. The content on the computer screen is a 3D modeling process of this miniature. Next to the computer screen is a toy packaging box, designed in a style reminiscent of high-quality collectible miniature, printed with original artwork. The packaging features two-dimensional flat illustrations"
  },
  "retro-ad-poster": {
    title: "Retro Ad Poster",
    description: "Authentic retro‑era ad poster with the product front and center.",
    prompt: "Make this product in the picture into an retro style ad poster that is carries a vibe of retro era, creative, product focused"
  },
  "miniature-in-hand": {
    title: "Miniature in Hand",
    description: "Studio photo of a hyper‑detailed miniature between fingers on white.",
    prompt: "A high-resolution advertising photograph of a realistic, miniature version of the product in the picture held delicately between a person's thumb and index finger.  clean and white background, studio lighting, soft shadows. The hand is well-groomed, natural skin tone, and positioned to highlight the product’s shape and details. The product appears extremely small but hyper-detailed and brand-accurate, centered in the frame with a shallow depth of field. Emulates luxury product photography and minimalist commercial style."
  }
};

const TemplateBase = () => {
  const navigate = useNavigate();
  const { templateId } = useParams<{ templateId: string }>();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [additionalInput, setAdditionalInput] = useState("");
  const [apiKeySet, setApiKeySet] = useState(() => {
    // Check if API key is available from environment or already initialized
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return isGeminiInitialized() || (envApiKey && envApiKey !== 'your_api_key_here');
  });

  // Track canvas container height to sync filmstrip height
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeights = () => {
      if (canvasContainerRef.current) {
        const next = canvasContainerRef.current.offsetHeight;
        if (next && next !== canvasHeight) {
          setCanvasHeight(next);
        }
      }
    };
    updateHeights();
    window.addEventListener('resize', updateHeights);
    return () => window.removeEventListener('resize', updateHeights);
  }, [canvasHeight, currentImage, sourceImage, isGenerating]);

  const template = templateId ? templates[templateId] : null;

  const handleImageUpload = (base64DataUrl: string, file: File) => {
    setSourceImage(base64DataUrl);
    setCurrentImage(base64DataUrl);
  };

  const handleImageSelect = (imageUrl: string) => {
    setCurrentImage(imageUrl);
  };

  const handleClearCanvas = () => {
    setCurrentImage(null);
    setSourceImage(null);
    // Keep generated images in filmstrip - don't clear them
  };

  const handleGenerate = async () => {
    if (!sourceImage || !template) return;

    setIsGenerating(true);
    
    try {
      // Build dynamic prompt string as per image-api-example-guide.md
      const baseTemplatePrompt = template.prompt;
      const dynamicPrompt = `${baseTemplatePrompt}${additionalInput ? "\n\nAdditional Instructions: " + additionalInput : ""}`;
      console.log("[TemplateBase] Dynamic Prompt:", dynamicPrompt);

      // Use streaming-based generation for templates
      const generatedImageUrl = await generateTemplateImage(sourceImage, dynamicPrompt);
      
      const newImage = {
        id: Date.now().toString(),
        url: generatedImageUrl,
        prompt: `Template: ${template.title} - ${baseTemplatePrompt}${additionalInput ? ` | Additional: ${additionalInput}` : ""}`
      };
      
      setGeneratedImages([...generatedImages, newImage]);
      setCurrentImage(generatedImageUrl);
      toast.success(`Image generated successfully with ${template.title} template!`);
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
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
      {/* Sidebar - Same as Dashboard */}
      <div className="w-64 bg-card border-r border-border/40 p-6 flex flex-col h-screen">
        <div className="flex-1">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <img src="/applogo.png" alt="RenderShot AI" className="h-8 w-8 rounded" />
            <span className="text-xl font-bold text-foreground">RenderShot AI</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="space-y-6">
              <div>
                <div className="space-y-1">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Dashboard</span>
                  </button>
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">FEATURES</div>
                <div className="space-y-1">
                  <button
                    onClick={() => navigate('/dashboard/virtual-photoshoot')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
                  >
                    <Camera className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Virtual Photoshoot</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/virtual-models')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
                  >
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">Virtual Models</span>
                  </button>
                  <button
                    onClick={() => navigate('/dashboard/ugc-style')}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
                  >
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">UGC-Style Shots</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>

        
      </div>

      {/* Main Content - Following wireframe design */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">{template.title}</h1>
            <p className="text-muted-foreground">{template.description}</p>
          </div>

          {/* Studio Canvas with Right-side Filmstrip - equal heights */}
          <div className="flex gap-6 items-start flex-nowrap">
            {/* Canvas Area */}
            <div className="flex-1" ref={canvasContainerRef}>
              <Canvas 
                onImageUpload={handleImageUpload}
                onImageSelect={handleImageSelect}
                onClearCanvas={handleClearCanvas}
                currentImage={currentImage || undefined}
                isGenerating={isGenerating}
              />
            </div>

            {/* Vertical Filmstrip - Right side (match canvas height and 1:1 width to thumbnails) */}
            <div
              className="shrink-0"
              style={{
                height: canvasHeight ? `${canvasHeight}px` : undefined,
                width: canvasHeight ? `${canvasHeight / 4}px` : undefined
              }}
            >
              <Filmstrip 
                images={[
                  ...(sourceImage ? [{
                    id: 'source',
                    url: sourceImage,
                    prompt: 'Source Image',
                    isSource: true
                  }] : []),
                  ...generatedImages
                ]}
                activeImageId={currentImage === sourceImage ? 'source' : generatedImages.find(img => img.url === currentImage)?.id}
                onImageSelect={handleImageSelect}
                isGenerating={isGenerating}
                orientation="vertical"
                verticalFitCount={4}
              />
            </div>
          </div>

          {/* Instruction Input with Generate button inside (right aligned) */}
          <div className="mt-4">
            <div className="w-full relative">
              <input 
                type="text" 
                placeholder="Additional instruction (optional)"
                className="w-full px-4 pr-36 py-3 rounded-md border border-border/40 bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={additionalInput}
                onChange={(e) => setAdditionalInput(e.target.value)}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !sourceImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBase;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Sparkles, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/studio/ImageUpload";
import ControlPanel from "@/components/studio/ControlPanel";
import GeneratedImages from "@/components/studio/GeneratedImages";
import { ApiKeyInput } from "@/components/studio/ApiKeyInput";
import { generateStudioImage, isGeminiInitialized } from "@/services/geminiService";
import { toast } from "sonner";

const UGCStyle = () => {
  const navigate = useNavigate();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(() => {
    // Check if API key is available from environment or already initialized
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return isGeminiInitialized() || (envApiKey && envApiKey !== 'your_api_key_here');
  });

  const handleImageUpload = (base64DataUrl: string, file: File) => {
    setUploadedImage(base64DataUrl);
  };

  const handleGenerate = async (settings: any) => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    
    try {
      // Use the new narrative prompt technique for UGC-Style
      // Pass the settings object directly to generateStudioImage, which will build the narrative prompt
      const generatedImageUrl = await generateStudioImage(uploadedImage, settings, "ugc-style", settings.backgroundImage);
      
      // Create a readable prompt summary for display purposes
      let promptSummary = "UGC-style authentic shot with narrative prompt: ";
      
      if (settings.shotComposition) {
        const compositionMap: { [key: string]: string } = {
          'product-only': 'Product Only',
          'pov': 'First-Person View (POV)',
          'selfie': 'Selfie with Product',
          'candid': 'Candid Action'
        };
        promptSummary += compositionMap[settings.shotComposition] || settings.shotComposition;
      }
      
      if (settings.photoStyle) {
        const styleMap: { [key: string]: string } = {
          'modern': 'Modern Smartphone',
          'action': 'Action Shot',
          'golden': 'Golden Hour'
        };
        promptSummary += `, ${styleMap[settings.photoStyle] || settings.photoStyle}`;
      }
      
      if (settings.backgroundTab === "presets" && settings.backgroundType !== "auto") {
        promptSummary += `, ${settings.backgroundType} background`;
        if (settings.backgroundStyle) {
          promptSummary += ` (${settings.backgroundStyle})`;
        }
      } else if (settings.backgroundTab === "describe" && settings.backgroundDescription) {
        promptSummary += `, custom background: ${settings.backgroundDescription}`;
      } else if (settings.backgroundTab === "upload" && settings.backgroundImage) {
        promptSummary += ", custom uploaded background";
      } else {
        promptSummary += ", auto background";
      }
      
      
      const newImage = {
        id: Date.now().toString(),
        url: generatedImageUrl,
        prompt: promptSummary
      };
      
      setGeneratedImages([...generatedImages, newImage]);
      toast.success("Image generated successfully with narrative prompt!");
    } catch (error) {
      console.error("Generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

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

          {/* Navigation */}
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
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">UGC-Style Shots</span>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Studio Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">UGC-Style Studio</h1>
              <p className="text-muted-foreground">
                Create authentic user-generated content that converts with natural, engaging product photography
              </p>
            </div>

            {/* API Key Input or Upload Area */}
            {!apiKeySet ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">Setup Required</h2>
                <p className="text-muted-foreground text-center">Please enter your Google GenAI API key to start generating images.</p>
                <ApiKeyInput onApiKeySet={() => setApiKeySet(true)} />
              </div>
            ) : (
              <>
                <ImageUpload 
                  onImageUpload={handleImageUpload}
                  uploadedImage={uploadedImage || undefined}
                />

                {/* Generated Images */}
                <GeneratedImages 
                  sourceImage={uploadedImage || undefined}
                  generatedImages={generatedImages}
                  isGenerating={isGenerating}
                />
              </>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <ControlPanel 
          studioType="ugc-style"
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
};

export default UGCStyle;
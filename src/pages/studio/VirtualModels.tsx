import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Users, Sparkles, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import Canvas from "@/components/studio/Canvas";
import Filmstrip from "@/components/studio/Filmstrip";
import ControlPanel from "@/components/studio/ControlPanel";
import { ApiKeyInput } from "@/components/studio/ApiKeyInput";
import { generateStudioImage, isGeminiInitialized } from "@/services/geminiService";
import { toast } from "sonner";

const VirtualModels = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeySet, setApiKeySet] = useState(() => {
    // Check if API key is available from environment or already initialized
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    return isGeminiInitialized() || (envApiKey && envApiKey !== 'your_api_key_here');
  });

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

  const handleGenerate = async (settings: any) => {
    if (!sourceImage) return;

    setIsGenerating(true);
    
    try {
      // Use the new narrative prompt technique for Virtual Models
      // Pass the settings object directly to generateStudioImage, which will build the narrative prompt
      const generatedImageUrl = await generateStudioImage(sourceImage, settings, "virtual-models", settings.backgroundImage);
      
      // Create a readable prompt summary for display purposes
      let promptSummary = "Virtual model lifestyle shot with narrative prompt: ";
      
      if (settings.gender && settings.gender !== "any") {
        promptSummary += `${settings.gender} model`;
      } else {
        promptSummary += "any gender model";
      }
      
      if (settings.ageRange && settings.ageRange !== "any") {
        promptSummary += `, ${settings.ageRange}`;
      }
      
      if (settings.ethnicity && settings.ethnicity !== "any") {
        promptSummary += `, ${settings.ethnicity}`;
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
      
      if (settings.cameraTab === "preset" && settings.cameraPreset) {
        promptSummary += `, ${settings.cameraPreset} shot`;
      } else if (settings.cameraTab === "describe" && settings.cameraDescription) {
        promptSummary += `, custom framing: ${settings.cameraDescription}`;
      } else {
        promptSummary += ", auto camera angle";
      }
      
      const newImage = {
        id: Date.now().toString(),
        url: generatedImageUrl,
        prompt: promptSummary
      };
      
      setGeneratedImages([...generatedImages, newImage]);
      setCurrentImage(generatedImageUrl);
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
                  <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">Virtual Models</span>
                  </div>
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

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Studio Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Virtual Models Studio</h1>
              <p className="text-muted-foreground">
                Generate lifestyle shots with AI models wearing or using your products
              </p>
            </div>

            {/* API Key Input or Canvas Area */}
            {!apiKeySet ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-center">Setup Required</h2>
                <p className="text-muted-foreground text-center">Please enter your Google GenAI API key to start generating images.</p>
                <ApiKeyInput onApiKeySet={() => setApiKeySet(true)} />
              </div>
            ) : (
              <div className="space-y-2">
                {/* Main Canvas */}
                <Canvas 
                  onImageUpload={handleImageUpload}
                  onImageSelect={handleImageSelect}
                  onClearCanvas={handleClearCanvas}
                  currentImage={currentImage || undefined}
                  isGenerating={isGenerating}
                />

                {/* Filmstrip */}
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
                />
              </div>
            )}
          </div>
        </div>

        {/* Control Panel */}
        <ControlPanel 
          studioType="virtual-models"
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
};

export default VirtualModels;
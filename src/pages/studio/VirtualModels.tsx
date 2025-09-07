import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Users, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUpload from "@/components/studio/ImageUpload";
import ControlPanel from "@/components/studio/ControlPanel";
import GeneratedImages from "@/components/studio/GeneratedImages";
import { ApiKeyInput } from "@/components/studio/ApiKeyInput";
import { generateStudioImage, isGeminiInitialized } from "@/services/geminiService";
import { toast } from "sonner";

const VirtualModels = () => {
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
      // Use the new narrative prompt technique for Virtual Models
      // Pass the settings object directly to generateStudioImage, which will build the narrative prompt
      const generatedImageUrl = await generateStudioImage(uploadedImage, settings, "virtual-models", settings.backgroundImage);
      
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
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-primary/10 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">Virtual Models</span>
              </div>
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
          studioType="virtual-models"
          onGenerate={handleGenerate}
        />
      </div>
    </div>
  );
};

export default VirtualModels;
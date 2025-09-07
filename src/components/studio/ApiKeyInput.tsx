import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { initializeGemini, isGeminiInitialized } from "@/services/geminiService";
import { toast } from "sonner";

interface ApiKeyInputProps {
  onApiKeySet: () => void;
}

export function ApiKeyInput({ onApiKeySet }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast.error("Please enter your Google GenAI API key");
      return;
    }

    setIsSubmitting(true);
    
    try {
      initializeGemini(apiKey.trim());
      
      if (isGeminiInitialized()) {
        toast.success("API key set successfully!");
        onApiKeySet();
      } else {
        toast.error("Failed to initialize Gemini API");
      }
    } catch (error) {
      console.error("Error setting API key:", error);
      toast.error("Failed to set API key");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Google GenAI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your API key..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={isSubmitting}
          />
          <p className="text-sm text-muted-foreground">
            Get your API key from{" "}
            <a 
              href="https://aistudio.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google AI Studio
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Tip: You can also set VITE_GEMINI_API_KEY in your .env.local file to avoid entering it every time.
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Setting up..." : "Set API Key"}
        </Button>
      </form>
    </Card>
  );
}
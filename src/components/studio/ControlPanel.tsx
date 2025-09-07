import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedButton } from "@/components/ui/button-variants";
import { Upload, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

interface ControlPanelProps {
  studioType: "virtual-photoshoot" | "virtual-models" | "ugc-style";
  onGenerate: (settings: any) => void;
}

const ControlPanel = ({ studioType, onGenerate }: ControlPanelProps) => {
  const [settings, setSettings] = useState({
    backgroundTab: "presets",
    backgroundType: "auto",
    backgroundStyle: "",
    backgroundDescription: "",
    backgroundImage: null as string | null,
    cameraTab: "auto",
    cameraPreset: "",
    cameraDescription: "",
    gender: "any",
    ageRange: "any",
    ethnicity: "any",
    photoStyle: "modern",
    shotComposition: studioType === "ugc-style" ? "selfie" : "product-only",
    aspectRatio: "1:1 square"
  });

  // Helper function to convert File to base64 data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleBackgroundImageUpload = async (file: File) => {
    if (file.type.startsWith('image/')) {
      try {
        const base64DataUrl = await fileToBase64(file);
        setSettings({...settings, backgroundImage: base64DataUrl});
        toast.success("Background image uploaded successfully!");
      } catch (error) {
        console.error('Failed to convert file to base64:', error);
        toast.error("Failed to upload background image");
      }
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleBackgroundImageUpload(e.target.files[0]);
    }
  };

  const clearBackgroundImage = () => {
    setSettings({...settings, backgroundImage: null});
  };

  const handleGenerate = () => {
    // Validate background upload
    if (settings.backgroundTab === "upload" && !settings.backgroundImage) {
      toast.error("Please upload a background image when using the upload option");
      return;
    }
    onGenerate(settings);
  };


  const renderBackgroundControls = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-foreground">Background</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={settings.backgroundTab} onValueChange={(value) => setSettings({...settings, backgroundTab: value})}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="describe">Describe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="space-y-4">
            <div className="space-y-3">
              <Label>Type</Label>
              <Tabs value={settings.backgroundType} onValueChange={(value) => setSettings({...settings, backgroundType: value})}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="auto" className={settings.backgroundType === "auto" ? "border-primary text-primary border-2" : ""}>Auto</TabsTrigger>
                  <TabsTrigger value="studio">
                    {studioType === "ugc-style" ? "Indoor" : "Studio"}
                  </TabsTrigger>
                  <TabsTrigger value="outdoor">Outdoor</TabsTrigger>
                </TabsList>
              </Tabs>
              
              {(settings.backgroundType === "studio" || settings.backgroundType === "outdoor") && (
                <Select onValueChange={(value) => setSettings({...settings, backgroundStyle: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      settings.backgroundType === "outdoor"
                        ? "Select outdoor theme"
                        : (settings.backgroundType === "studio" && studioType === "ugc-style")
                          ? "Select indoor theme"
                          : `Select ${settings.backgroundType} style`
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {settings.backgroundType === "studio" && studioType !== "ugc-style" && (
                      <>
                        <SelectItem value="white-seamless">White Seamless</SelectItem>
                        <SelectItem value="gradient-backdrop">Gradient Backdrop</SelectItem>
                        <SelectItem value="textured-wall">Textured Wall</SelectItem>
                      </>
                    )}
                    {settings.backgroundType === "studio" && studioType === "ugc-style" && (
                      <>
                        <SelectItem value="cafe">Cafe</SelectItem>
                        <SelectItem value="at-home">At Home</SelectItem>
                        <SelectItem value="in-car">In a Car</SelectItem>
                      </>
                    )}
                    {settings.backgroundType === "outdoor" && (
                      <>
                        <SelectItem value="beach">Beach</SelectItem>
                        <SelectItem value="forest">Forest</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                        <SelectItem value="garden">Garden</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            {!settings.backgroundImage ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Upload custom background image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                  id="background-upload"
                />
                <label htmlFor="background-upload">
                  <Button variant="outline" asChild className="mt-4 cursor-pointer">
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={settings.backgroundImage}
                  alt="Uploaded background"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur"
                  onClick={clearBackgroundImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="describe" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="background-desc">Background Description</Label>
              <Textarea 
                id="background-desc"
                placeholder="Describe your ideal background..."
                value={settings.backgroundDescription}
                onChange={(e) => setSettings({...settings, backgroundDescription: e.target.value})}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );

  const renderCameraControls = () => (
    studioType !== "ugc-style" && (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Camera Angle</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={settings.cameraTab} onValueChange={(value) => setSettings({...settings, cameraTab: value})}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="auto" className={settings.cameraTab === "auto" ? "border-primary text-primary border-2" : ""}>Auto</TabsTrigger>
              <TabsTrigger value="preset">Preset</TabsTrigger>
              <TabsTrigger value="describe">Describe</TabsTrigger>
            </TabsList>
          
          <TabsContent value="preset" className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {studioType === "virtual-photoshoot" && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "front-view" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "front-view"})}
                  >
                    Front View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "side-view" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "side-view"})}
                  >
                    Side View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "top-down" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "top-down"})}
                  >
                    Top-down
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "45-angle" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "45-angle"})}
                  >
                    45° Angle
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "close-up" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "close-up"})}
                  >
                    Close-up
                  </Button>
                </>
              )}
              {studioType === "virtual-models" && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "full-body" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "full-body"})}
                  >
                    Full Body
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "upper-body" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "upper-body"})}
                  >
                    Upper Body
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={settings.cameraPreset === "close-up-product" ? "border-primary text-primary border-2" : ""}
                    onClick={() => setSettings({...settings, cameraPreset: "close-up-product"})}
                  >
                    Close-up on Product
                  </Button>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="describe" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="camera-desc">
                {studioType === "virtual-models" ? "Shot Framing Description" : "Camera Angle Description"}
              </Label>
              <Textarea 
                id="camera-desc"
                placeholder="Describe the camera angle..."
                value={settings.cameraDescription}
                onChange={(e) => setSettings({...settings, cameraDescription: e.target.value})}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
    )
  );

  const renderModelControls = () => (
    studioType === "virtual-models" && (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Model Characteristics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select value={settings.gender} onValueChange={(value) => setSettings({...settings, gender: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Age Range</Label>
            <Select value={settings.ageRange} onValueChange={(value) => setSettings({...settings, ageRange: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="18-25">18-25</SelectItem>
                <SelectItem value="25-40">25-40</SelectItem>
                <SelectItem value="40+">40+</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Ethnicity</Label>
            <Select value={settings.ethnicity} onValueChange={(value) => setSettings({...settings, ethnicity: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="black">Black</SelectItem>
                <SelectItem value="latino">Latino</SelectItem>
                <SelectItem value="white">White</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    )
  );

  const renderUGCControls = () => (
    studioType === "ugc-style" && (
      <>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Photo Style</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: "modern", label: "Modern Smartphone (Clear)" },
                { value: "action", label: "Action Shot (Slight Blur)" },
                { value: "golden", label: "Golden Hour" }
              ].map((style) => (
                <Button
                  key={style.value}
                  variant="outline"
                  className={settings.photoStyle === style.value ? "border-primary text-primary border-2" : ""}
                  onClick={() => setSettings({...settings, photoStyle: style.value})}
                >
                  {style.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Shot Composition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-2">
              {[
                { value: "product-only", label: "Product Only" },
                { value: "pov", label: "First-Person View (POV)" },
                { value: "selfie", label: "Selfie with Product" },
                { value: "candid", label: "Candid Action" }
              ].map((comp) => (
                <Button
                  key={comp.value}
                  variant="outline"
                  className={settings.shotComposition === comp.value ? "border-primary text-primary border-2" : ""}
                  onClick={() => setSettings({...settings, shotComposition: comp.value})}
                >
                  {comp.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </>
    )
  );

  const renderAspectRatioControls = () => (
    // Aspect ratio controls removed from all studio types
    null
  );

  return (
    <div className="w-80 space-y-6 p-6 bg-card border-l border-border/40 overflow-y-auto">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-foreground">Control Panel</h2>
        <p className="text-sm text-muted-foreground">Customize your image generation</p>
      </div>

      {studioType === "virtual-models" && renderModelControls()}
      {renderBackgroundControls()}
      {renderCameraControls()}
      {renderUGCControls()}
      {renderAspectRatioControls()}

      <EnhancedButton 
        variant="hero" 
        className="w-full"
        onClick={handleGenerate}
      >
        <Sparkles className="h-4 w-4 mr-2" />
        Generate Image
      </EnhancedButton>
    </div>
  );
};

export default ControlPanel;
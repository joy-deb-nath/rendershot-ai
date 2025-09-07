import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedButton } from "@/components/ui/button-variants";
import { Camera, Users, Sparkles, LogOut, Palette, Image, Zap } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const features = [
    {
      id: "virtual-photoshoot",
      title: "Virtual Photoshoot",
      description: "Professional studio backgrounds and lighting",
      icon: Camera,
      route: "/dashboard/virtual-photoshoot"
    },
    {
      id: "virtual-models",
      title: "Virtual Models",
      description: "AI models showcasing your products",
      icon: Users,
      route: "/dashboard/virtual-models"
    },
    {
      id: "ugc-style",
      title: "UGC-Style Shots",
      description: "Authentic user-generated content style",
      icon: Sparkles,
      route: "/dashboard/ugc-style"
    }
  ];

  const templates = [
    {
      id: "template-1",
      title: "Minimalist Studio",
      description: "Clean white background with professional lighting",
      preview: "##########"
    },
    {
      id: "template-2", 
      title: "Lifestyle Context",
      description: "Natural home environment with warm lighting",
      preview: "##########"
    },
    {
      id: "template-3",
      title: "Editorial Fashion",
      description: "High-end magazine style with dramatic shadows",
      preview: "##########"
    },
    {
      id: "template-4",
      title: "E-commerce Hero",
      description: "Perfect for product listings and catalogs",
      preview: "##########"
    }
  ];

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

          {/* Navigation */}
          <nav className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-4">DASHBOARD</div>
            
            <div className="space-y-6">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">FEATURES</div>
                <div className="space-y-1">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => navigate(feature.route)}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors"
                    >
                      <feature.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{feature.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-8">
            <EnhancedButton 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </EnhancedButton>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Choose a feature or template to start creating amazing product visuals</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card 
                key={feature.id} 
                className="cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 bg-gradient-card border-border/40"
                onClick={() => navigate(feature.route)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Library */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Template Library</h2>
              <p className="text-muted-foreground">Quick-start templates for instant results</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 bg-card border-border/40"
                  onClick={() => navigate(`/dashboard/${template.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3">
                      <div className="text-4xl font-mono text-muted-foreground">{template.preview}</div>
                    </div>
                    <CardTitle className="text-lg text-foreground">{template.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-gradient-card border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">0</div>
                    <div className="text-sm text-muted-foreground">Images Generated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Palette className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground">Available Studios</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/40">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary-glow/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary-glow" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">100</div>
                    <div className="text-sm text-muted-foreground">Credits Remaining</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
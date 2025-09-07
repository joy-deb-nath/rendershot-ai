import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, Sparkles, LayoutDashboard } from "lucide-react";
import thumb01 from "@/assets/template_thumbnail_01.jpg";
import thumb02 from "@/assets/template_thumbnail_02.jpg";
import thumb03 from "@/assets/template_thumbnail_03.jpg";
import thumb04 from "@/assets/template_thumbnail_04.jpg";

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
      id: "ad-poster",
      title: "Ad Poster",
      description: "Premium ad poster with dramatic lighting and polished Photoshop compositing.",
      preview: thumb01
    },
    {
      id: "miniature-on-desk", 
      title: "Miniature on Desk",
      description: "Realistic 1/7‑scale miniature on a desk with modeling screen and packaging.",
      preview: thumb02
    },
    {
      id: "retro-ad-poster",
      title: "Retro Ad Poster",
      description: "Authentic retro‑era ad poster with the product front and center.",
      preview: thumb03
    },
    {
      id: "miniature-in-hand",
      title: "Miniature in Hand",
      description: "Studio photo of a hyper‑detailed miniature between fingers on white.",
      preview: thumb04
    }
  ];

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
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left hover:bg-accent/10 transition-colors bg-accent/5"
                  >
                    <LayoutDashboard className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground font-medium">Dashboard</span>
                  </button>
                </div>
              </div>
              
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
        </div>

        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col h-screen">
        <div className="max-w-6xl mx-auto flex-1 flex flex-col">
          {/* Header */}
          <div className="space-y-2 mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Choose a feature or template to start creating amazing product visuals</p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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

          {/* Template Library - positioned at bottom */}
          <div className="mt-auto">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-foreground">Template Library</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id}
                    className="cursor-pointer hover:shadow-card transition-all duration-300 hover:scale-105 bg-card border-border/40"
                    onClick={() => navigate(`/template/${template.id}`)}
                  >
                    <div className="flex p-6">
                      {/* Thumbnail - Left side */}
                      <div className="w-40 aspect-video bg-muted rounded-lg overflow-hidden mr-4 flex-shrink-0">
                        <img src={template.preview} alt={template.title}
                          className="w-full h-full object-cover" />
                      </div>
                      
                      {/* Details - Right side */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2">{template.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
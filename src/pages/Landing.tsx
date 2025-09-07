import { useNavigate } from "react-router-dom";
import { EnhancedButton } from "@/components/ui/button-variants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Sparkles, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Camera,
      title: "Virtual Photoshoot",
      description: "Transform any product photo into professional studio-quality images with AI-powered backgrounds and lighting."
    },
    {
      icon: Users,
      title: "Virtual Models",
      description: "Generate realistic lifestyle shots with AI models wearing or using your products across diverse demographics."
    },
    {
      icon: Sparkles,
      title: "UGC-Style Content",
      description: "Create authentic user-generated content that converts with natural, engaging product photography."
    }
  ];

  const benefits = [
    "Generate 100+ unique product visuals in minutes",
    "Reduce photography costs by up to 90%",
    "AI-powered with Gemini 2.5 Flash technology",
    "Professional studio-quality results",
    "Multiple aspect ratios for all platforms",
    "No design experience required"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">RenderCam AI</span>
          </div>
          <EnhancedButton 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
          >
            Get Started
          </EnhancedButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  Powered by Gemini 2.5 Flash AI
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Transform Your
                  <span className="block bg-gradient-premium bg-clip-text text-transparent">
                    Product Photos
                  </span>
                  with AI Magic
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Generate stunning product visuals, lifestyle shots, and marketing images from a single photo. 
                  Perfect for e-commerce, marketing teams, and solo entrepreneurs.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <EnhancedButton 
                  variant="hero" 
                  size="hero"
                  onClick={() => navigate('/dashboard')}
                  className="group"
                >
                  Start Creating Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </EnhancedButton>
                <EnhancedButton variant="outline" size="hero">
                  View Examples
                </EnhancedButton>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-premium rounded-full blur-3xl opacity-20 scale-75" />
              <img 
                src={heroImage} 
                alt="RenderCam AI Hero" 
                className="relative z-10 w-full h-auto rounded-2xl shadow-premium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">
              Three Powerful AI Studios
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Each studio is specifically designed to create different types of product visuals, 
              giving you complete creative control over your brand imagery.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border/40 hover:shadow-card transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-foreground">
                  Why Choose RenderCam AI?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Stop spending thousands on product photography. Create professional visuals 
                  in minutes, not weeks.
                </p>
              </div>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <EnhancedButton 
                variant="premium" 
                size="lg"
                onClick={() => navigate('/dashboard')}
                className="group"
              >
                Start Your Free Trial
                <Zap className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              </EnhancedButton>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-card rounded-lg border border-border/40" />
                  <div className="h-40 bg-gradient-card rounded-lg border border-border/40" />
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-40 bg-gradient-card rounded-lg border border-border/40" />
                  <div className="h-32 bg-gradient-card rounded-lg border border-border/40" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-premium opacity-5 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-background/90" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              Ready to Transform Your Product Photography?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of businesses already using RenderCam AI to create stunning product visuals.
            </p>
            <EnhancedButton 
              variant="hero" 
              size="hero"
              onClick={() => navigate('/dashboard')}
              className="group"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </EnhancedButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold text-foreground">RenderCam AI</span>
            </div>
            <p className="text-muted-foreground">
              © 2024 RenderCam AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
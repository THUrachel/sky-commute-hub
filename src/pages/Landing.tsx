import { useState } from "react";
import { Plane, ArrowRight, Clock, Shield, TrendingUp, Package, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/landing-hero.jpg";
import manufacturingImage from "@/assets/manufacturing-scenario.jpg";
import retailImage from "@/assets/retail-scenario.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredScenario, setHoveredScenario] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Plane className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Aeolus</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#solution" className="text-muted-foreground hover:text-foreground transition-colors">
                Solution
              </a>
              <a href="#scenarios" className="text-muted-foreground hover:text-foreground transition-colors">
                Use Cases
              </a>
              <Button onClick={() => navigate("/book")} className="bg-gradient-primary">
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Aeolus eVTOL over city"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white animate-fade-in">
            Transport in the
            <br />
            Third Dimension
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto animate-fade-in">
            On-demand aerial delivery and transport for time-critical business needs
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/book")}
            className="bg-gradient-primary text-lg h-14 px-8 animate-fade-in hover:scale-105 transition-transform"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The Challenge
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Urban congestion and rising business expectations have made it difficult for retailers 
              to deliver high-value, lightweight products and for passengers to travel within tight time windows. 
              Current ground-based and drone delivery options often fail to meet the required speed, 
              security, or flexibility for time-critical transport.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="p-6 bg-background rounded-xl border border-border">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Time Pressure</h3>
                <p className="text-muted-foreground text-sm">
                  Every minute of downtime costs businesses thousands
                </p>
              </div>
              <div className="p-6 bg-background rounded-xl border border-border">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Rising Expectations</h3>
                <p className="text-muted-foreground text-sm">
                  Customers demand faster, more flexible delivery
                </p>
              </div>
              <div className="p-6 bg-background rounded-xl border border-border">
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Limited Options</h3>
                <p className="text-muted-foreground text-sm">
                  Current solutions lack speed, security, or reliability
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="solution" className="py-24 bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Solution
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12">
              Enable on-demand, two-hour delivery and transport for sensitive cargo, 
              ensuring reliability, safety, and real-time visibility from booking to arrival.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">2-Hour Delivery</h3>
                <p className="text-muted-foreground">
                  Skip traffic and get there fast with aerial transport
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Secure Transport</h3>
                <p className="text-muted-foreground">
                  Direct point-to-point delivery with full security
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Real-Time Tracking</h3>
                <p className="text-muted-foreground">
                  Complete visibility from booking to arrival
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B Scenarios Section */}
      <section id="scenarios" className="py-24 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              B2B Use Cases
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Transforming critical business operations across industries
            </p>
          </div>

          {/* Manufacturing Scenario */}
          <div 
            className="mb-16 overflow-hidden rounded-2xl border border-border bg-background transition-all duration-500 hover:shadow-elevated"
            onMouseEnter={() => setHoveredScenario('manufacturing')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-[400px] md:h-auto overflow-hidden">
                <img
                  src={manufacturingImage}
                  alt="Manufacturing facility"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredScenario === 'manufacturing' ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-transparent" />
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-primary mb-4">
                  <Package className="h-5 w-5" />
                  <span className="font-semibold">Manufacturing & Industry</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Critical Parts & Technicians
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  When automated manufacturing equipment fails, every minute counts. 
                  Aeolus delivers technicians with specialized parts directly to production facilities, 
                  minimizing costly downtime.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Reduce equipment downtime by 80%</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Expert technicians arrive within 2 hours</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Save thousands per hour in lost production</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate("/book")}
                  className="w-fit"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Retail Scenario */}
          <div 
            className="overflow-hidden rounded-2xl border border-border bg-background transition-all duration-500 hover:shadow-elevated"
            onMouseEnter={() => setHoveredScenario('retail')}
            onMouseLeave={() => setHoveredScenario(null)}
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center order-2 md:order-1">
                <div className="inline-flex items-center gap-2 text-primary mb-4">
                  <User className="h-5 w-5" />
                  <span className="font-semibold">Luxury Retail</span>
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  High-End Retail Services
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Nordstrom sends expert tailors with curated wedding dress collections directly 
                  to clients' homes. Personalized, white-glove service that transforms luxury retail experiences.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Private in-home consultations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Curated collections delivered on-demand</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-muted-foreground">Elevate brand prestige and customer satisfaction</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate("/book")}
                  className="w-fit"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <div className="relative h-[400px] md:h-auto overflow-hidden order-1 md:order-2">
                <img
                  src={retailImage}
                  alt="Luxury retail consultation"
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    hoveredScenario === 'retail' ? 'scale-110' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-background/60 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the future of time-critical transport and delivery
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/book")}
              className="bg-gradient-primary text-lg h-14 px-8 hover:scale-105 transition-transform"
            >
              Book Your First Flight
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Plane className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Aeolus</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Aeolus. Trusted Transport in the Third Dimension.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

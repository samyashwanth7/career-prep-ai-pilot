import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  BarChart2, 
  Users, 
  ArrowRight, 
  Play, 
  Star, 
  TrendingUp, 
  Target,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  Quote
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <Badge variant="secondary" className="mx-auto">
              🚀 AI-Powered Interview Practice
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground tracking-tight">
              Master Your Next Interview with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AceInterview AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto">
              Practice with AI-powered mock interviews, get real-time feedback, and track your progress with anonymous peer comparisons
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" className="px-8 py-6 text-lg font-medium">
                <Link to="/auth">
                  Start Practice Interview
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg font-medium">
                <Link to="/demo">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose AceInterview AI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced AI technology meets proven interview techniques
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-primary" />}
              title="AI-Powered Practice"
              text="Practice with realistic interview scenarios powered by advanced AI that adapts to your responses"
            />
            <FeatureCard
              icon={<BarChart2 className="w-8 h-8 text-primary" />}
              title="Performance Analytics"
              text="Track your progress with detailed analytics and compare anonymously with peers"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-primary" />}
              title="Peer Comparison"
              text="See how you stack up against others in your field while maintaining complete anonymity"
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-primary" />}
              title="Real-time Feedback"
              text="Get instant, actionable feedback on your responses to improve faster"
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-primary" />}
              title="Industry-Specific"
              text="Tailored questions for different roles: Tech, Finance, Healthcare, and more"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-primary" />}
              title="Flexible Practice"
              text="Practice anytime, anywhere with our responsive platform"
            />
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Trusted by Job Seekers Worldwide
            </h2>
            <div className="flex justify-center items-center gap-8 mb-8">
              <StatCard number="10,000+" label="Practice Sessions" />
              <StatCard number="85%" label="Success Rate" />
              <StatCard number="4.9/5" label="User Rating" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="AceInterview AI helped me land my dream job at a Fortune 500 company. The peer comparison feature kept me motivated!"
              author="Software Engineer"
              rating={5}
            />
            <TestimonialCard
              quote="The AI feedback was incredibly detailed. I improved my communication skills significantly in just 2 weeks."
              author="Product Manager"
              rating={5}
            />
            <TestimonialCard
              quote="Finally, a platform that makes interview practice engaging and effective. The analytics are game-changing."
              author="Data Scientist"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of successful candidates who've transformed their interview skills with AI-powered practice
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8 py-6 text-lg font-medium">
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg font-medium">
              <Link to="/demo">
                Try Demo First
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{text}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-muted-foreground">{label}</div>
    </div>
  );
}

function TestimonialCard({ quote, author, rating }: { quote: string; author: string; rating: number }) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <Quote className="w-8 h-8 text-muted-foreground mb-4" />
      <p className="text-foreground mb-4 italic">"{quote}"</p>
      <p className="text-muted-foreground text-sm">— {author}</p>
    </div>
  );
}
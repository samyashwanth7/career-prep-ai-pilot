import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ArrowRight, Star, Users, MessageSquare, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Interview Questions", value: "500+", icon: MessageSquare },
    { label: "AI-Powered Feedback", value: "Real-time", icon: CheckCircle },
    { label: "Success Rate", value: "95%", icon: Star },
    { label: "Active Users", value: "1,000+", icon: Users },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 text-sm border-accent/50 bg-accent/10 text-accent"
          >
            <Star className="w-4 h-4 mr-2 fill-accent" />
            Trusted by 1,000+ job seekers worldwide
          </Badge>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
        >
          Master Your Interview Skills
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            with AI-Powered Practice
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
        >
          Get personalized feedback, build confidence, and land your dream job.
          Practice anytime with our AI interviewer that adapts to your experience.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground text-lg px-8 py-6 rounded-xl shadow-lg shadow-primary/25"
            onClick={() => navigate("/demo")}
          >
            Start Free Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-border hover:bg-muted text-foreground text-lg px-8 py-6 rounded-xl"
            onClick={() => {
              const el = document.querySelector("#how-it-works");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Play className="w-5 h-5 mr-2" />
            Watch How It Works
          </Button>
        </motion.div>

        {/* No signup required badge */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm text-muted-foreground mb-16"
        >
          ✨ No credit card required • Free demo available • Cancel anytime
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 text-center hover:border-accent/50 transition-colors"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
              <div className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Mock Interview Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-2xl" />
          <div className="relative bg-card border border-border rounded-2xl p-4 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="ml-4 text-sm text-muted-foreground">
                AceInterview AI - Mock Interview Session
              </span>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 text-left">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                  AI
                </div>
                <div className="flex-1">
                  <p className="text-foreground">
                    "Tell me about a challenging project you worked on and how you overcame obstacles."
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold">
                  You
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-accent/30 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-accent/20 rounded w-1/2 mt-2 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

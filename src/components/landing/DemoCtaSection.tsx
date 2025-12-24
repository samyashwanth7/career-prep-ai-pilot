import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Zap } from "lucide-react";

const DemoCtaSection: React.FC = () => {
  const navigate = useNavigate();

  const demoFeatures = [
    "3 free practice questions",
    "Real-time AI feedback",
    "No signup required",
    "Instant results",
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-6 px-4 py-2 border-accent/50 bg-accent/10 text-accent"
          >
            <Zap className="w-4 h-4 mr-2" />
            Try it now - No signup needed
          </Badge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Experience the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Demo
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            See how AceInterview AI works with our interactive demo. Practice real
            interview questions and get AI-powered feedback instantly.
          </p>

          {/* Demo Features */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {demoFeatures.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground text-lg px-10 py-6 rounded-xl shadow-lg shadow-primary/25"
              onClick={() => navigate("/demo")}
            >
              <Play className="w-5 h-5 mr-2" />
              Start Free Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted text-lg px-10 py-6 rounded-xl"
              onClick={() => navigate("/signup")}
            >
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Demo Limitation Note */}
          <p className="text-sm text-muted-foreground mt-8">
            Demo Mode: 3 questions available • Full access with free account
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoCtaSection;

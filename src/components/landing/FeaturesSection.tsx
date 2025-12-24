import React from "react";
import { motion } from "framer-motion";
import {
  Target,
  BarChart3,
  Mic,
  Briefcase,
  Trophy,
  RefreshCw,
  Brain,
  Clock,
} from "lucide-react";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Feedback",
      description:
        "Get instant, detailed analysis of your answers with specific suggestions for improvement. Our AI evaluates clarity, relevance, and structure.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description:
        "Monitor your improvement over time with detailed analytics. See your strengths, weaknesses, and areas that need more practice.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Mic,
      title: "Voice & Video Practice",
      description:
        "Practice with realistic interview simulations using voice recording. Get feedback on your communication style and delivery.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Briefcase,
      title: "Industry-Specific Prep",
      description:
        "Tailored questions for your target role and company. Practice technical, behavioral, and situational questions.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: Trophy,
      title: "Performance Analytics",
      description:
        "Track your scores across different categories. Identify patterns and focus on areas that need the most improvement.",
      color: "from-pink-500 to-rose-500",
    },
    {
      icon: RefreshCw,
      title: "Unlimited Practice",
      description:
        "Practice as much as you need, anytime, anywhere. No limits on sessions or questions. Keep improving until you're ready.",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Brain,
      title: "Smart Question Generation",
      description:
        "Questions adapt based on your resume and experience level. Get relevant challenges that match your career goals.",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Clock,
      title: "Quick Warmup Mode",
      description:
        "Short 5-minute practice sessions for daily interview prep. Perfect for building consistent practice habits.",
      color: "from-amber-500 to-orange-500",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform gives you all the tools to prepare for any interview
            and land your dream job.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 rounded-2xl blur transition-opacity duration-300 from-primary/50 to-accent/50" />
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full hover:border-accent/50 transition-colors">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;

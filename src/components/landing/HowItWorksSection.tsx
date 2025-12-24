import React from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquare, BarChart2, TrendingUp } from "lucide-react";

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Choose Your Interview Type",
      description:
        "Select from technical, behavioral, or company-specific interviews. Upload your resume for personalized questions.",
      color: "from-purple-500 to-indigo-500",
    },
    {
      number: "02",
      icon: MessageSquare,
      title: "Practice with AI Interviewer",
      description:
        "Answer questions via text or voice. Our AI adapts to your responses and asks relevant follow-up questions.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "03",
      icon: BarChart2,
      title: "Receive Instant Feedback",
      description:
        "Get detailed analysis of your answers including clarity score, relevance rating, and specific improvement tips.",
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "04",
      icon: TrendingUp,
      title: "Track Your Progress",
      description:
        "Monitor improvement over time with analytics dashboard. See your growth and identify areas needing focus.",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            How It{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and begin improving your interview skills today.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Step Card */}
                <div className="bg-card border border-border rounded-2xl p-6 relative z-10 hover:border-accent/50 transition-colors h-full">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6">
                    <div
                      className={`w-16 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center`}
                    >
                      <span className="text-white font-bold text-sm">{step.number}</span>
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-r ${step.color} flex items-center justify-center mt-4 mb-4`}
                  >
                    <step.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

import React from 'react';
import { 
  Brain, 
  BarChart3, 
  Target, 
  Mic, 
  TrendingUp, 
  Smartphone,
  ArrowRight
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Feedback',
      description: 'Get detailed, personalized analysis instantly after every practice session.',
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: BarChart3,
      title: 'Progress Analytics',
      description: 'Track improvement with comprehensive dashboards and performance metrics.',
      color: 'bg-success/10 text-success',
    },
    {
      icon: Target,
      title: 'Role-Specific Practice',
      description: 'Questions tailored to your target position and industry experience level.',
      color: 'bg-accent/10 text-accent',
    },
    {
      icon: Mic,
      title: 'Voice & Video Practice',
      description: 'Realistic interview simulations with speech recognition and analysis.',
      color: 'bg-warning/10 text-warning',
    },
    {
      icon: TrendingUp,
      title: 'Build Confidence',
      description: 'Practice until you\'re interview-ready with adaptive difficulty levels.',
      color: 'bg-destructive/10 text-destructive',
    },
    {
      icon: Smartphone,
      title: 'Practice Anywhere',
      description: 'Mobile-friendly platform so you can practice interviews on the go.',
      color: 'bg-primary/10 text-primary',
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose Our AI Interviewer?
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to prepare for your dream job interview, powered by cutting-edge AI technology.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-card rounded-xl border border-border p-8 hover-lift cursor-pointer"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-4">
                {feature.description}
              </p>

              {/* Learn More Link */}
              <a
                href="#"
                className="inline-flex items-center text-primary font-medium text-sm group-hover:underline"
              >
                Learn more
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

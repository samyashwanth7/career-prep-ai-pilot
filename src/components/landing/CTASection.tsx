import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl gradient-primary overflow-hidden">
          {/* Background Patterns */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="relative px-8 py-16 lg:py-24 text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-8">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Next Interview?
            </h2>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10">
              Join thousands of successful job seekers who transformed their interview skills with our AI-powered platform.
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              onClick={() => navigate('/demo')}
              className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90 transition-colors shadow-lg"
            >
              Start Free Practice
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            {/* Trust Text */}
            <p className="text-white/60 text-sm mt-6">
              No credit card required • 3 free practice sessions • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

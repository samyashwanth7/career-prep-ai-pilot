import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Play, CheckCircle, Sparkles, Mic, BarChart3, MessageSquare } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const trustBadges = [
    { icon: CheckCircle, text: 'No credit card required' },
    { icon: CheckCircle, text: '500+ practice questions' },
    { icon: CheckCircle, text: 'Instant AI feedback' },
  ];

  return (
    <section className="relative pt-32 pb-20 lg:pb-32 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Interview Coach
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Master Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Interview Skills
              </span>{' '}
              with AI
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              Get personalized feedback, track progress, and build confidence
              through realistic interview simulations powered by advanced AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                onClick={() => navigate('/demo')}
                className="h-14 px-8 text-lg gradient-primary text-white hover:opacity-90 transition-opacity shadow-lg"
              >
                Start Free Practice
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {}}
                className="h-14 px-8 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 justify-center lg:justify-start pt-4">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center text-sm text-muted-foreground"
                >
                  <badge.icon className="w-4 h-4 mr-2 text-success" />
                  {badge.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card rounded-2xl shadow-elevated border border-border p-6 animate-fade-up">
                {/* Interview Interface Preview */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-success" />
                      <span className="text-sm font-medium text-foreground">Live Interview</span>
                    </div>
                    <span className="text-sm text-muted-foreground">2:30 remaining</span>
                  </div>

                  {/* Question */}
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-foreground font-medium">
                      "Tell me about a time when you had to lead a team through a challenging project..."
                    </p>
                  </div>

                  {/* Recording Indicator */}
                  <div className="flex items-center justify-center py-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center animate-pulse-soft">
                        <Mic className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute -inset-2 rounded-full border-2 border-primary/30 animate-ping" />
                    </div>
                  </div>

                  {/* Live Transcription */}
                  <div className="bg-muted/50 rounded-lg p-3 border border-border">
                    <p className="text-sm text-muted-foreground italic">
                      "In my previous role, I led a cross-functional team of 8 engineers..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -right-4 bg-card rounded-xl shadow-card border border-border p-4 animate-float">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Score</p>
                    <p className="text-lg font-bold text-foreground">92%</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-card border border-border p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">AI Feedback</p>
                    <p className="text-sm font-medium text-foreground">Great structure!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

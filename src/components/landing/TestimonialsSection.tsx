import React from 'react';
import { Star, Users, Trophy, Building2, MessageSquare } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "This platform completely transformed my interview preparation. I went from anxious to confident in just two weeks!",
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      avatar: "SC",
      rating: 5,
    },
    {
      quote: "The AI feedback is incredibly detailed and actionable. It's like having a personal interview coach available 24/7.",
      name: "Marcus Johnson",
      role: "Product Manager at Meta",
      avatar: "MJ",
      rating: 5,
    },
    {
      quote: "I practiced every day for a month and landed offers from 3 top tech companies. This tool is a game-changer.",
      name: "Priya Patel",
      role: "Data Scientist at Amazon",
      avatar: "PP",
      rating: 5,
    },
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Users' },
    { icon: Trophy, value: '95%', label: 'Success Rate' },
    { icon: Building2, value: '500+', label: 'Companies' },
    { icon: MessageSquare, value: '50,000+', label: 'Interviews' },
  ];

  return (
    <section id="testimonials" className="py-20 lg:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals who landed their dream jobs with our AI interview coach.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card rounded-xl border border-border p-8 hover-lift"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground mb-6 text-lg italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-border">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

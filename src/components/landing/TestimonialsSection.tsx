import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Software Engineer",
      company: "Now at Google",
      avatar: "SM",
      rating: 5,
      quote:
        "AceInterview AI completely transformed my interview prep. The AI feedback was incredibly detailed and helped me identify weaknesses I didn't know I had. Landed my dream job at Google!",
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      company: "Now at Meta",
      avatar: "MC",
      rating: 5,
      quote:
        "The behavioral interview practice was a game-changer. I went from nervous and unprepared to confident and articulate. The progress tracking kept me motivated throughout.",
    },
    {
      name: "Emily Rodriguez",
      role: "Data Scientist",
      company: "Now at Amazon",
      avatar: "ER",
      rating: 5,
      quote:
        "As a career changer, I was terrified of technical interviews. This platform helped me practice at my own pace and build real confidence. The AI questions were surprisingly realistic!",
    },
    {
      name: "James Wilson",
      role: "Frontend Developer",
      company: "Now at Netflix",
      avatar: "JW",
      rating: 5,
      quote:
        "The company-specific practice feature was invaluable. I felt like I had already done the Netflix interview before walking in. Highly recommend for anyone serious about their career.",
    },
  ];

  const stats = [
    { value: "1,000+", label: "Job Seekers Helped" },
    { value: "85%", label: "Confidence Improvement" },
    { value: "92%", label: "Interview Success Rate" },
    { value: "50+", label: "Universities Using Us" },
  ];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />

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
            Loved by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Job Seekers
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who've transformed their interview skills and
            landed their dream jobs.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 bg-card border border-border rounded-2xl"
            >
              <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-accent/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-accent/30 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-foreground mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

import React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Code, Database, Cloud, Cpu } from "lucide-react";

const AboutSection: React.FC = () => {
  const techStack = [
    { name: "React", icon: Code, color: "text-blue-400" },
    { name: "TypeScript", icon: Code, color: "text-blue-500" },
    { name: "Tailwind CSS", icon: Code, color: "text-cyan-400" },
    { name: "Supabase", icon: Database, color: "text-green-400" },
    { name: "OpenAI GPT", icon: Cpu, color: "text-purple-400" },
    { name: "Cloud Functions", icon: Cloud, color: "text-orange-400" },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-muted/30">
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
            About{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              AceInterview AI
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with passion to help job seekers overcome interview anxiety and land their
            dream jobs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">Our Story</h3>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We built AceInterview AI after experiencing firsthand the challenges of
              interview preparation. Traditional methods felt outdated, and there was no way
              to get realistic practice without bothering friends or paying for expensive
              coaching.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Our mission is simple: democratize interview preparation. Everyone deserves
              access to high-quality, personalized feedback that helps them present their
              best selves.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Using cutting-edge AI technology, we've created an interviewer that's always
              available, never judgmental, and provides actionable feedback that actually
              helps you improve.
            </p>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">Technology Stack</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="bg-card border border-border rounded-xl p-4 text-center hover:border-accent/50 transition-colors"
                >
                  <tech.icon className={`w-8 h-8 mx-auto mb-2 ${tech.color}`} />
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                </div>
              ))}
            </div>

            {/* Problem Statement */}
            <div className="mt-8 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-6">
              <h4 className="font-semibold text-foreground mb-2">
                📊 The Problem We're Solving
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• 92% of job seekers experience interview anxiety</li>
                <li>• Most candidates practice alone without feedback</li>
                <li>• Professional coaching costs $100-500/hour</li>
                <li>• Limited access to realistic practice scenarios</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

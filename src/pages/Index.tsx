
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, BarChart2, Users, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10">
      <div className="max-w-xl text-center space-y-6 mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-primary dark:text-white tracking-tight">
          Welcome to <span className="text-indigo-500">MyCorpPro</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-medium">
          Elevate your career journey with AI-powered tools, insights, and a professional platform tailored for success.
        </p>
        <Button asChild size="lg" className="mt-6 font-semibold shadow-lg">
          <Link to="/dashboard">
            Get Started
            <ArrowRight className="ml-3 h-5 w-5" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Briefcase className="w-8 h-8 text-indigo-500" />}
          title="Smart Job Search"
          text="Discover jobs matched by skill, experience, & goals using our state-of-the-art AI."
        />
        <FeatureCard
          icon={<BarChart2 className="w-8 h-8 text-indigo-500" />}
          title="Advanced Analytics"
          text="Track your application success, interview performance, and progress over time."
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-indigo-500" />}
          title="Career Community"
          text="Connect with top professionals, mentors, and company insiders."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-white/90 dark:bg-sidebar/80 rounded-xl shadow p-8 flex flex-col items-center text-center transition hover:scale-105 hover:shadow-lg cursor-pointer">
      <div className="mb-4">{icon}</div>
      <div className="font-bold text-lg text-primary dark:text-white mb-2">{title}</div>
      <div className="text-muted-foreground">{text}</div>
    </div>
  );
}

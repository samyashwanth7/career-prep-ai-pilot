import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, BarChart2, Users, ArrowRight } from "lucide-react";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-12 px-4">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight">
          Welcome to <span className="text-indigo-600 dark:text-indigo-400">AceInterviewAI</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 font-light leading-relaxed">
          Elevate your career journey with AI-powered tools, insights, and a professional platform tailored for success.
        </p>
        <Button asChild size="lg" className="mt-8 px-8 py-3 text-lg font-medium">
          <Link to="/dashboard">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <FeatureCard
          icon={<Briefcase className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
          title="Smart Job Search"
          text="Discover jobs matched by skill, experience, & goals using our state-of-the-art AI."
        />
        <FeatureCard
          icon={<BarChart2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
          title="Advanced Analytics"
          text="Track your application success, interview performance, and progress over time."
        />
        <FeatureCard
          icon={<Users className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />}
          title="Career Community"
          text="Connect with top professionals, mentors, and company insiders."
        />
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{text}</p>
    </div>
  );
}
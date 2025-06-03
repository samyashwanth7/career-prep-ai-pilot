
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, Users, BarChart3, Briefcase, Sparkles, ChevronRight, Play, Star } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const features = [
    {
      icon: Briefcase,
      title: "Smart Job Applications",
      description: "Apply to multiple jobs with AI-generated cover letters and track your success rate",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mic,
      title: "AI Stress Interviews",
      description: "Practice with voice recording, real-time stress analysis, and adaptive questioning",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Company-Specific Practice",
      description: "Experience FAANG-style interviews with company-specific questions and culture",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track your progress with detailed analytics and personalized improvement suggestions",
      color: "from-orange-500 to-red-500"
    }
  ];

  const companies = [
    { name: "Google", logo: "🔍", interviews: 234 },
    { name: "Meta", logo: "📘", interviews: 189 },
    { name: "Amazon", logo: "📦", interviews: 156 },
    { name: "Apple", logo: "🍎", interviews: 143 },
    { name: "Microsoft", logo: "🪟", interviews: 167 },
    { name: "Netflix", logo: "🎬", interviews: 89 }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer at Google",
      content: "The stress interview simulator prepared me perfectly for the real thing. Got my dream job!",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Product Manager at Meta",
      content: "Company-specific practice made all the difference. The questions were spot-on.",
      rating: 5
    },
    {
      name: "Aisha Patel",
      role: "Data Scientist at Amazon",
      content: "Analytics dashboard helped me identify weak spots and improve systematically.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">AI Interviewer</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <span className="text-gray-300">Welcome, {currentUser.name}</span>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 py-12">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Ace Your Next
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {" "}Interview
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Master technical interviews with AI-powered simulation, company-specific practice, 
              and real-time performance analytics. Land your dream job with confidence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg px-8 py-4"
              onClick={() => navigate(currentUser ? '/dashboard' : '/signup')}
            >
              {currentUser ? 'Go to Dashboard' : 'Start Free Trial'}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-4"
              onClick={() => navigate('/demo')}
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
              <div className="text-3xl font-bold text-white mb-2">10K+</div>
              <div className="text-gray-400">Interviews Conducted</div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
              <div className="text-3xl font-bold text-white mb-2">89%</div>
              <div className="text-gray-400">Success Rate</div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
              <div className="text-3xl font-bold text-white mb-2">500+</div>
              <div className="text-gray-400">Companies</div>
            </Card>
            <Card className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-gray-400">AI Available</div>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Everything You Need to Succeed
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/10 p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Companies Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Practice with Top Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companies.map((company, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/10 p-6 text-center hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{company.logo}</div>
                <h3 className="text-white font-semibold mb-1">{company.name}</h3>
                <p className="text-gray-400 text-sm">{company.interviews} interviews</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Success Stories
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/5 backdrop-blur-lg border-white/10 p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="text-white font-semibold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 backdrop-blur-lg border-white/10 p-12">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful candidates who've used our platform to ace their interviews.
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-lg px-8 py-4"
              onClick={() => navigate(currentUser ? '/dashboard' : '/signup')}
            >
              {currentUser ? 'Continue Learning' : 'Start Your Journey'}
              <ChevronRight className="ml-2 w-5 h-5" />
            </Button>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2024 AI Interviewer Platform. Empowering careers through technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

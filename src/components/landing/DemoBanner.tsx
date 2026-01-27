import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Target, ArrowRight, X } from 'lucide-react';

interface DemoBannerProps {
  questionsRemaining?: number;
  onDismiss?: () => void;
}

const DemoBanner: React.FC<DemoBannerProps> = ({ 
  questionsRemaining = 3,
  onDismiss 
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-r from-primary via-accent to-primary text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          <span className="font-medium">
            Demo Mode: Try {questionsRemaining} questions free, no signup required
          </span>
        </div>
        
        <Button
          size="sm"
          variant="secondary"
          onClick={() => navigate('/signup')}
          className="bg-white text-primary hover:bg-white/90"
        >
          Sign up to unlock unlimited practice
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default DemoBanner;

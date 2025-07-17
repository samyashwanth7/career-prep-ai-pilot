import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    careerLevel: '',
    industry: '',
    targetRole: '',
    yearsExperience: 0,
    jobStatus: '',
    skillAssessmentScore: 0
  });

  const careerLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-7 years)' },
    { value: 'senior', label: 'Senior Level (8+ years)' }
  ];

  const industries = [
    'Technology', 'Finance', 'Healthcare', 'Marketing', 'Sales', 
    'Education', 'Consulting', 'Manufacturing', 'Retail', 'Other'
  ];

  const jobStatuses = [
    { value: 'student', label: 'Student' },
    { value: 'employed', label: 'Currently Employed' },
    { value: 'job_seeking', label: 'Job Seeking' }
  ];

  const targetRoles = [
    'Software Engineer', 'Product Manager', 'Data Scientist', 'Marketing Manager',
    'Sales Representative', 'Business Analyst', 'Designer', 'Consultant', 'Other'
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          career_level: formData.careerLevel,
          industry: formData.industry,
          target_role: formData.targetRole,
          years_experience: formData.yearsExperience,
          job_status: formData.jobStatus,
          skill_assessment_score: formData.skillAssessmentScore
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile completed!',
        description: 'Your profile has been set up successfully.'
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your profile. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Career Background</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="careerLevel">Career Level</Label>
                <Select value={formData.careerLevel} onValueChange={(value) => 
                  setFormData({ ...formData, careerLevel: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your career level" />
                  </SelectTrigger>
                  <SelectContent>
                    {careerLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="yearsExperience">Years of Experience</Label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                  placeholder="Enter years of experience"
                />
              </div>

              <div>
                <Label htmlFor="jobStatus">Current Status</Label>
                <Select value={formData.jobStatus} onValueChange={(value) => 
                  setFormData({ ...formData, jobStatus: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current status" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Industry & Role</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => 
                  setFormData({ ...formData, industry: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="targetRole">Target Role</Label>
                <Select value={formData.targetRole} onValueChange={(value) => 
                  setFormData({ ...formData, targetRole: value })
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your target role" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Skill Assessment</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="skillAssessment">Rate your interview confidence (1-100)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.skillAssessmentScore}
                  onChange={(e) => setFormData({ ...formData, skillAssessmentScore: parseInt(e.target.value) || 0 })}
                  placeholder="Enter your confidence level"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How confident do you feel about your current interview skills?
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.careerLevel && formData.jobStatus && formData.yearsExperience >= 0;
      case 2:
        return formData.industry && formData.targetRole;
      case 3:
        return formData.skillAssessmentScore > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Help us personalize your experience and match you with relevant peers</p>
          
          <div className="mt-4">
            <Progress value={(step / 3) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {step} of 3</p>
          </div>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepValid() || loading}
          >
            {loading ? 'Saving...' : (step === 3 ? 'Complete Setup' : 'Next')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
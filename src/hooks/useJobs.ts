
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Job, JobApplication, JobFilters } from '@/types/job';

export const useJobs = () => {
  const { toast } = useToast();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [filters, setFilters] = useState<JobFilters>({
    searchTerm: '',
    locationFilter: 'all',
    typeFilter: 'all',
    experienceFilter: 'all',
    salaryFilter: 'all'
  });

  const sampleJobs: Job[] = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Google',
      location: 'Mountain View, CA',
      salary: '$150k - $200k',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Join our team to build the next generation of web experiences.',
      requirements: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
      benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours'],
      postedDate: '2024-01-15',
      applicants: 45,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'Meta',
      location: 'Menlo Park, CA',
      salary: '$140k - $180k',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Build scalable applications that connect billions of people.',
      requirements: ['React', 'Node.js', 'Python', 'GraphQL', 'PostgreSQL'],
      benefits: ['Health Insurance', 'Stock Options', 'Remote Work'],
      postedDate: '2024-01-14',
      applicants: 67,
      rating: 4.6
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'Amazon',
      location: 'Seattle, WA',
      salary: '$130k - $170k',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Help us scale our e-commerce platform to new heights.',
      requirements: ['Java', 'AWS', 'Microservices', 'Docker', 'Kubernetes'],
      benefits: ['Health Insurance', 'Stock Options', 'Career Growth'],
      postedDate: '2024-01-13',
      applicants: 89,
      rating: 4.4
    },
    {
      id: '4',
      title: 'Backend Developer',
      company: 'Netflix',
      location: 'Los Gatos, CA',
      salary: '$145k - $190k',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Build the infrastructure that powers global streaming.',
      requirements: ['Java', 'Scala', 'Microservices', 'AWS', 'Kafka'],
      benefits: ['Health Insurance', 'Unlimited PTO', 'Stock Options'],
      postedDate: '2024-01-12',
      applicants: 34,
      rating: 4.7
    },
    {
      id: '5',
      title: 'Frontend Engineer',
      company: 'Spotify',
      location: 'Stockholm, Sweden',
      salary: '€80k - €110k',
      type: 'Full-time',
      experience: 'Mid',
      description: 'Create amazing music experiences for millions of users.',
      requirements: ['React', 'TypeScript', 'Redux', 'CSS', 'Testing'],
      benefits: ['Health Insurance', 'Music Subscription', 'Flexible Location'],
      postedDate: '2024-01-11',
      applicants: 56,
      rating: 4.5
    },
    {
      id: '6',
      title: 'DevOps Engineer',
      company: 'Uber',
      location: 'San Francisco, CA',
      salary: '$140k - $180k',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Scale our infrastructure to handle millions of rides.',
      requirements: ['Kubernetes', 'AWS', 'Terraform', 'Python', 'Docker'],
      benefits: ['Health Insurance', 'Stock Options', 'Commuter Benefits'],
      postedDate: '2024-01-10',
      applicants: 23,
      rating: 4.3
    }
  ];

  useEffect(() => {
    const savedJobs = localStorage.getItem('availableJobs');
    if (!savedJobs) {
      localStorage.setItem('availableJobs', JSON.stringify(sampleJobs));
      setJobs(sampleJobs);
      setFilteredJobs(sampleJobs);
    } else {
      const parsedJobs = JSON.parse(savedJobs);
      setJobs(parsedJobs);
      setFilteredJobs(parsedJobs);
    }

    const savedApplications = localStorage.getItem('jobApplications');
    if (savedApplications) {
      setApplications(JSON.parse(savedApplications));
    }
  }, []);

  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           job.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                           job.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesLocation = filters.locationFilter === 'all' || job.location.includes(filters.locationFilter);
      const matchesType = filters.typeFilter === 'all' || job.type === filters.typeFilter;
      const matchesExperience = filters.experienceFilter === 'all' || job.experience === filters.experienceFilter;
      const matchesSalary = filters.salaryFilter === 'all' || checkSalaryRange(job.salary, filters.salaryFilter);

      return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesSalary;
    });

    setFilteredJobs(filtered);
  }, [filters, jobs]);

  const checkSalaryRange = (jobSalary: string, filterRange: string) => {
    const salaryNum = parseInt(jobSalary.replace(/[^0-9]/g, ''));
    switch (filterRange) {
      case 'under-100k': return salaryNum < 100000;
      case '100k-150k': return salaryNum >= 100000 && salaryNum <= 150000;
      case 'over-150k': return salaryNum > 150000;
      default: return true;
    }
  };

  const updateFilters = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      locationFilter: 'all',
      typeFilter: 'all',
      experienceFilter: 'all',
      salaryFilter: 'all'
    });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const applyToJobs = async (jobsToApply: Job[], resume: File | null, coverLetterText: string, currentUser: any) => {
    try {
      let resumeBase64 = '';
      if (resume) {
        resumeBase64 = await fileToBase64(resume);
      }

      const newApplications: JobApplication[] = [];
      
      for (const job of jobsToApply) {
        const existingApplication = applications.find(app => 
          app.jobId === job.id && app.userId === currentUser.id
        );
        
        if (existingApplication) {
          continue;
        }

        const application: JobApplication = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          userId: currentUser.id,
          jobId: job.id,
          job: job,
          resume: resumeBase64,
          coverLetter: coverLetterText,
          status: 'submitted',
          appliedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        
        newApplications.push(application);
      }

      const updatedApplications = [...applications, ...newApplications];
      setApplications(updatedApplications);
      localStorage.setItem('jobApplications', JSON.stringify(updatedApplications));
      
      const userStats = JSON.parse(localStorage.getItem('userStats') || '{}');
      userStats.totalApplications = (userStats.totalApplications || 0) + newApplications.length;
      userStats.applicationsThisWeek = (userStats.applicationsThisWeek || 0) + newApplications.length;
      localStorage.setItem('userStats', JSON.stringify(userStats));

      toast({
        title: "Applications submitted!",
        description: `Successfully applied to ${newApplications.length} job(s).`,
      });

      return true;
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    jobs,
    filteredJobs,
    applications,
    filters,
    updateFilters,
    clearFilters,
    applyToJobs
  };
};

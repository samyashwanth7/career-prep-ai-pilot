
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { JobFilters } from '@/types/job';

interface JobsFiltersProps {
  filters: JobFilters;
  onFiltersChange: (filters: Partial<JobFilters>) => void;
  onClearFilters: () => void;
  totalJobs: number;
  filteredJobs: number;
}

const JobsFilters: React.FC<JobsFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalJobs,
  filteredJobs
}) => {
  const hasActiveFilters = filters.searchTerm || 
    (filters.locationFilter && filters.locationFilter !== 'all') || 
    (filters.typeFilter && filters.typeFilter !== 'all') || 
    (filters.experienceFilter && filters.experienceFilter !== 'all') || 
    (filters.salaryFilter && filters.salaryFilter !== 'all');

  return (
    <div className="mb-8">
      <div className="grid lg:grid-cols-6 gap-4 mb-4">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search jobs or companies..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        
        <Select value={filters.locationFilter} onValueChange={(value) => onFiltersChange({ locationFilter: value })}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="WA">Washington</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.typeFilter} onValueChange={(value) => onFiltersChange({ typeFilter: value })}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
            <SelectItem value="Freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.experienceFilter} onValueChange={(value) => onFiltersChange({ experienceFilter: value })}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Experience" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="Entry">Entry Level</SelectItem>
            <SelectItem value="Mid">Mid Level</SelectItem>
            <SelectItem value="Senior">Senior Level</SelectItem>
            <SelectItem value="Lead">Lead/Principal</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.salaryFilter} onValueChange={(value) => onFiltersChange({ salaryFilter: value })}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Salary" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700">
            <SelectItem value="all">All Salaries</SelectItem>
            <SelectItem value="under-100k">Under $100k</SelectItem>
            <SelectItem value="100k-150k">$100k - $150k</SelectItem>
            <SelectItem value="over-150k">Over $150k</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Clear Filters
            </Button>
          )}
        </div>
        <p className="text-gray-400 text-sm">
          Showing {filteredJobs} of {totalJobs} jobs
        </p>
      </div>
    </div>
  );
};

export default JobsFilters;

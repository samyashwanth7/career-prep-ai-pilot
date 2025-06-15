
import React from 'react';
import { Button } from '@/components/ui/button';

interface TimeframeSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
}
const choices = [
  { value: '7days', label: '7D' },
  { value: '30days', label: '30D' },
  { value: '90days', label: '90D' },
  { value: 'all', label: 'All' },
];

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ selected, onSelect }) => (
  <div className="flex gap-2">
    {choices.map(({ value, label }) => (
      <Button
        key={value}
        variant={selected === value ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect(value)}
        className="border-white/20 text-white"
      >
        {label}
      </Button>
    ))}
  </div>
);

export default TimeframeSelector;

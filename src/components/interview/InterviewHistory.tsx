
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface InterviewSession {
  id: string;
  date: string;
  category: string;
  questionText: string;
  transcription: string;
  overallScore: number;
  duration: number;
  feedback: {
    specificity: number;
    relevance: number;
    impact: number;
    structure: number;
    suggestions: string[];
  };
}

interface InterviewHistoryProps {
  currentUser: any;
  onViewSession?: (session: InterviewSession) => void;
}

const InterviewHistory: React.FC<InterviewHistoryProps> = ({ 
  currentUser, 
  onViewSession 
}) => {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<InterviewSession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (currentUser) {
      const savedSessions = localStorage.getItem(`interview_history_${currentUser.id}`);
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed);
        setFilteredSessions(parsed);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    let filtered = sessions;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.transcription.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(session => session.category === categoryFilter);
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, categoryFilter]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/20';
    if (score >= 60) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral':
        return 'bg-blue-500/20 text-blue-400';
      case 'technical':
        return 'bg-purple-500/20 text-purple-400';
      case 'situational':
        return 'bg-green-500/20 text-green-400';
      case 'communication':
        return 'bg-orange-500/20 text-orange-400';
      case 'problem-solving':
        return 'bg-pink-500/20 text-pink-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getAverageScore = () => {
    if (sessions.length === 0) return 0;
    return Math.round(sessions.reduce((sum, session) => sum + session.overallScore, 0) / sessions.length);
  };

  const categories = ['all', 'behavioral', 'technical', 'situational', 'communication', 'problem-solving'];

  if (sessions.length === 0) {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
        <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No Interview History</h3>
        <p className="text-gray-400">Complete your first interview practice session to see your history here.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <History className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{sessions.length}</div>
              <div className="text-gray-400 text-sm">Total Sessions</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{getAverageScore()}%</div>
              <div className="text-gray-400 text-sm">Average Score</div>
            </div>
          </div>
        </Card>
        
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {Math.round(sessions.reduce((sum, s) => sum + s.duration, 0) / 60)}
              </div>
              <div className="text-gray-400 text-sm">Total Minutes</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search questions or responses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.id} className="bg-white/10 backdrop-blur-lg border-white/20 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Badge className={getCategoryColor(session.category)}>
                    {session.category}
                  </Badge>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(session.date)}
                  </div>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    {session.duration}s
                  </div>
                </div>
                <h3 className="text-white font-medium mb-2 line-clamp-2">
                  {session.questionText}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {session.transcription}
                </p>
              </div>
              
              <div className="ml-4 text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full ${getScoreColor(session.overallScore)} font-semibold`}>
                  {session.overallScore}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Specificity: {session.feedback.specificity}%</span>
                <span>Relevance: {session.feedback.relevance}%</span>
                <span>Impact: {session.feedback.impact}%</span>
                <span>Structure: {session.feedback.structure}%</span>
              </div>
              
              {onViewSession && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewSession(session)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filteredSessions.length === 0 && (searchTerm || categoryFilter !== 'all') && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Results Found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </Card>
      )}
    </div>
  );
};

export default InterviewHistory;

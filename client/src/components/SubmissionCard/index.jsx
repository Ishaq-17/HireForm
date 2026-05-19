import React from 'react';
import { Calendar, User } from 'lucide-react';
import StatusBadge from '../StatusBadge';

const SubmissionCard = ({ submission, onClick }) => {
  const getCandidateName = () => {
    // Find field containing 'name'
    const nameField = submission.responses.find(r => 
      r.fieldLabel.toLowerCase().includes('name')
    );
    return nameField ? nameField.value : 'Anonymous Candidate';
  };

  const getCandidateEmail = () => {
    const emailField = submission.responses.find(r => 
      r.fieldLabel.toLowerCase().includes('email')
    );
    return emailField ? emailField.value : '';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-full"
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-800 line-clamp-1">{getCandidateName()}</h4>
              {getCandidateEmail() && (
                <p className="text-xs text-slate-500 line-clamp-1">{getCandidateEmail()}</p>
              )}
            </div>
          </div>
          <StatusBadge status={submission.status} />
        </div>

        <div className="pt-2 border-t border-slate-50 flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>Submitted {formatDate(submission.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;

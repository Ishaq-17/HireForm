import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import StatusBadge from '../../components/StatusBadge';
import { ArrowLeft, User, Calendar, Mail, FileText, CheckCircle2, ChevronRight } from 'lucide-react';

const SubmissionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await axiosInstance.get(`/submissions/${id}`);
      setSubmission(response.data);
    } catch (error) {
      console.error('Failed to fetch submission details', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    setSuccessMsg('');
    try {
      const response = await axiosInstance.put(`/submissions/${id}/status`, {
        status: newStatus,
      });
      setSubmission(response.data);
      setSuccessMsg(`Status updated to "${newStatus}"`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Failed to update submission status', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse"></div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 h-96 animate-pulse"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-500">Submission detail not found.</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 font-semibold mt-2 hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const getCandidateName = () => {
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Back breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <button onClick={() => navigate(-1)} className="hover:text-slate-850 transition-all font-semibold">
          Applicants List
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-400 font-medium">Applicant Details</span>
      </div>

      {/* Header Profile Box */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{getCandidateName()}</h1>
            <p className="text-slate-500 text-sm mt-0.5 flex items-center gap-1.5">
              <span>Applied for</span>
              <span className="font-bold text-slate-700">{submission.formId?.title || 'Unknown Position'}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase">Current Status:</span>
            <StatusBadge status={submission.status} />
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Applied on {new Date(submission.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-2 text-emerald-800">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-xs font-bold">{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Details + Recruiter Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Side: Responses */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 pb-3 border-b border-slate-100">Application Answers</h2>

          <div className="space-y-6">
            {submission.responses.map((res, index) => (
              <div key={index} className="space-y-1.5">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {res.fieldLabel}
                </span>

                {res.fieldType === 'File Upload' ? (
                  <div className="flex items-center justify-between border border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-all max-w-md">
                    <div className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px]">
                        {res.value || 'No File Uploaded'}
                      </span>
                    </div>
                    {res.value && (
                      <button
                        onClick={() => alert(`Simulated file download for resume: ${res.value}`)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-all"
                      >
                        Download File
                      </button>
                    )}
                  </div>
                ) : res.fieldType === 'Long Text' ? (
                  <p className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-100 whitespace-pre-wrap leading-relaxed">
                    {res.value || <span className="text-slate-400 italic">No response provided</span>}
                  </p>
                ) : (
                  <p className="text-base font-semibold text-slate-800 pl-1">
                    {res.value || <span className="text-slate-400 italic">No response provided</span>}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Recruiter Screening Controls */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">Recruiter Screening</h3>

          {getCandidateEmail() && (
            <div className="space-y-2">
              <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-slate-400">Quick Contact</span>
              <a
                href={`mailto:${getCandidateEmail()}`}
                className="flex items-center gap-2 px-3 py-2 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-all"
              >
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{getCandidateEmail()}</span>
              </a>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Update Stage</span>
            <div className="flex flex-col gap-2">
              {[
                { name: 'Reviewed', style: 'border-blue-200 hover:bg-blue-50 text-blue-700 bg-blue-50/20' },
                { name: 'Shortlisted', style: 'border-emerald-200 hover:bg-emerald-50 text-emerald-700 bg-emerald-50/20' },
                { name: 'Rejected', style: 'border-rose-200 hover:bg-rose-50 text-rose-700 bg-rose-50/20' },
              ].map((opt) => (
                <button
                  key={opt.name}
                  disabled={updating || submission.status === opt.name}
                  onClick={() => updateStatus(opt.name)}
                  className={`w-full py-2.5 px-4 border rounded-xl text-xs font-bold transition-all ${
                    submission.status === opt.name
                      ? 'border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed opacity-60'
                      : opt.style
                  }`}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;

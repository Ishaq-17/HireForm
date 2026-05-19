import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FileSpreadsheet, Send, CheckCircle2, AlertCircle, Upload, ArrowLeft } from 'lucide-react';

const PublicForm = () => {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchFormSchema();
  }, [slug]);

  const fetchFormSchema = async () => {
    try {
      const response = await axios.get(`/api/forms/public/${slug}`);
      setForm(response.data);
      const initialResponses = {};
      response.data.fields.forEach((f) => {
        initialResponses[f.label] = '';
      });
      setResponses(initialResponses);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load application form. Ensure the link is correct or that the form is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (label, val) => {
    setResponses({
      ...responses,
      [label]: val,
    });
  };

  const handleFileUpload = (label, e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange(label, file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form) return;

    for (let field of form.fields) {
      const value = responses[field.label]?.toString().trim() || '';
      if (field.required && !value) {
        setError(`"${field.label}" is a required field.`);
        return;
      }
      if (value && field.label.toLowerCase().includes('email')) {
        if (!value.toLowerCase().endsWith('@gmail.com')) {
          setError(`"${field.label}" must be a valid email ending with @gmail.com.`);
          return;
        }
      }
    }

    setSubmitting(true);
    setError('');

    try {
      const formattedResponses = form.fields.map((f) => ({
        fieldLabel: f.label,
        fieldType: f.type,
        value: responses[f.label] || '',
      }));

      await axios.post(`/api/submissions/${form._id}`, {
        responses: formattedResponses,
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold animate-pulse">Loading application form...</p>
        </div>
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xl text-center space-y-4">
          <AlertCircle className="w-14 h-14 text-red-500 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-900">Application Unavailable</h2>
          <p className="text-slate-500 text-sm">{error}</p>
          <div className="pt-4">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold transition-all">
              <ArrowLeft className="w-4 h-4" /> Go back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-lg w-full bg-white border border-slate-200 p-8 rounded-3xl shadow-xl text-center space-y-6">
          <div className="inline-flex w-16 h-16 rounded-full bg-emerald-50 items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Application Submitted!</h2>
            <p className="text-slate-500 text-sm">
              Thank you for applying to <span className="font-semibold text-slate-800">{form.title}</span>. Your application has been successfully transmitted.
            </p>
          </div>
          <p className="text-xs text-slate-400">
            You can close this tab now. The recruitment team has been notified.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-400/5 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-indigo-400/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-2xl mx-auto space-y-8 bg-white border border-slate-200 p-8 rounded-3xl shadow-xl relative z-10">
        {/* Branding & Job Title */}
        <div className="pb-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Job Opportunity</span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{form.title}</h1>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
            <FileSpreadsheet className="w-5 h-5 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">HireForm</span>
          </div>
        </div>

        {form.description && (
          <p className="text-slate-600 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-2xl p-4 border border-slate-100">
            {form.description}
          </p>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-sm transition-all duration-300">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Validation Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field._id} className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>

              {field.type === 'Short Text' && (
                <input
                  type="text"
                  required={field.required}
                  value={responses[field.label] || ''}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your response"
                />
              )}

              {field.type === 'Long Text' && (
                <textarea
                  required={field.required}
                  rows={4}
                  value={responses[field.label] || ''}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Enter detailed response"
                />
              )}

              {field.type === 'Dropdown' && (
                <select
                  required={field.required}
                  value={responses[field.label] || ''}
                  onChange={(e) => handleInputChange(field.label, e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select option...</option>
                  {field.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'File Upload' && (
                <div className="relative">
                  <input
                    type="file"
                    id={`file-${field._id}`}
                    required={field.required && !responses[field.label]}
                    onChange={(e) => handleFileUpload(field.label, e)}
                    className="hidden"
                  />
                  <label
                    htmlFor={`file-${field._id}`}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-5 cursor-pointer bg-slate-50 hover:bg-blue-50/20 transition-all text-slate-500 hover:text-blue-600"
                  >
                    <Upload className="w-6 h-6 mb-1 text-slate-400" />
                    <span className="text-xs font-semibold">
                      {responses[field.label] ? `Selected: ${responses[field.label]}` : 'Click to Upload Resume/File'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1">Accepts PDF, DOCX (Max 5MB)</span>
                  </label>
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-2xl font-bold shadow-lg shadow-blue-150 transition-all text-sm mt-8"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Submitting Application...' : 'Submit Application'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicForm;

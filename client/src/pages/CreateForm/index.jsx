import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import FieldBuilder from '../../components/FieldBuilder';
import FormPreview from '../../components/FormPreview';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';

const CreateForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('Frontend Developer Role');
  const [description, setDescription] = useState('Join our dynamic engineering team. Please complete the application below.');
  const [fields, setFields] = useState([
    {
      id: 'default-1',
      label: 'Full Name',
      type: 'Short Text',
      required: true,
      options: []
    },
    {
      id: 'default-2',
      label: 'Email Address',
      type: 'Short Text',
      required: true,
      options: []
    },
    {
      id: 'default-3',
      label: 'Years of Experience',
      type: 'Dropdown',
      required: true,
      options: ['Less than 1 year', '1 - 3 years', '3 - 5 years', '5+ years']
    }
  ]);
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a Form Title.');
      return;
    }
    if (fields.length === 0) {
      setError('Please add at least one dynamic field.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formattedFields = fields.map(({ label, type, required, options }) => ({
        label,
        type,
        required,
        options
      }));

      await axiosInstance.post('/forms', {
        title,
        description,
        fields: formattedFields,
        isActive
      });

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to publish form. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Job Form</h1>
            <p className="text-slate-500 text-sm mt-0.5">Customize your custom dynamic questions and preview candidate experience.</p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 transition-all text-sm"
        >
          <Save className="w-4.5 h-4.5" />
          <span>{loading ? 'Publishing...' : 'Publish Form'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-red-650 shrink-0 text-red-650 mt-0.5" />
          <p className="text-xs text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {/* Main Form Builder Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Job Details Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 pb-2 border-b border-slate-100">Job Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Job / Form Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g. Senior Product Designer"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Job Description / Instructions
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Tell candidates about this opportunity and list any general application rules..."
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                  Make form publicly active immediately
                </label>
              </div>
            </div>
          </div>

          {/* Dynamic Field Builder Box */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <FieldBuilder fields={fields} setFields={setFields} />
          </div>
        </div>

        {/* Right Hand: Live Preview */}
        <div className="lg:col-span-5">
          <FormPreview title={title} description={description} fields={fields} />
        </div>
      </div>
    </div>
  );
};

export default CreateForm;

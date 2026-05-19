import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Plus, Copy, Check, Trash2, ExternalLink, Inbox, FileText, Users, Eye } from 'lucide-react';

const Dashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  
  const [publicUrlSetting, setPublicUrlSetting] = useState(localStorage.getItem('public_url') || '');
  const [publicUrlInput, setPublicUrlInput] = useState('');
  const [isEditingUrl, setIsEditingUrl] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await axiosInstance.get('/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Failed to fetch forms', error);
    } finally {
      setLoading(false);
    }
  };

  const savePublicUrl = () => {
    let url = publicUrlInput.trim();
    if (url) {
      if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
      }
      url = url.replace(/\/$/, ''); // strip trailing slash
    }
    localStorage.setItem('public_url', url);
    setPublicUrlSetting(url);
    setIsEditingUrl(false);
  };

  const copyToClipboard = (slug, id) => {
    const origin = publicUrlSetting ? publicUrlSetting : window.location.origin;
    const publicUrl = `${origin}/form/${slug}`;
    
    try {
      // Copy both as plain text and rich HTML link
      const htmlText = `<a href="${publicUrl}">${publicUrl}</a>`;
      const blobHTML = new Blob([htmlText], { type: 'text/html' });
      const blobText = new Blob([publicUrl], { type: 'text/plain' });
      
      const data = [
        new ClipboardItem({
          'text/html': blobHTML,
          'text/plain': blobText,
        })
      ];
      
      navigator.clipboard.write(data);
    } catch (err) {
      // Fallback
      navigator.clipboard.writeText(publicUrl);
    }
    
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteForm = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job form and all associated candidate submissions? This cannot be undone.')) return;
    try {
      await axiosInstance.delete(`/forms/${id}`);
      setForms(forms.filter((f) => f._id !== id));
    } catch (error) {
      console.error('Failed to delete form', error);
    }
  };

  const totalForms = forms.length;
  const activeForms = forms.filter((f) => f.isActive).length;
  const totalSubmissions = forms.reduce((sum, f) => sum + (f.submissionCount || 0), 0);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Recruiter Dashboard</h1>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-slate-500 text-sm">
            <p>Manage your active recruitment campaigns.</p>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Link Domain:</span>
              {isEditingUrl ? (
                <div className="flex items-center gap-1 animate-pulse">
                  <input
                    type="text"
                    value={publicUrlInput}
                    onChange={(e) => setPublicUrlInput(e.target.value)}
                    placeholder="https://your-tunnel.devtunnels.ms"
                    className="px-2 py-0.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-slate-50 text-slate-700"
                  />
                  <button
                    onClick={savePublicUrl}
                    className="text-[10px] bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded-md font-bold transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingUrl(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-500 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setPublicUrlInput(publicUrlSetting);
                    setIsEditingUrl(true);
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold underline decoration-dotted transition-all cursor-pointer"
                  title="Configure custom domain (e.g. devtunnels) for sharing"
                >
                  {publicUrlSetting ? publicUrlSetting : 'Browser Default (Click to customize)'}
                </button>
              )}
            </div>
          </div>
        </div>
        <Link
          to="/forms/create"
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-indigo-100 transition-all text-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Create Job Form</span>
        </Link>
      </div>

      {/* Analytics Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Job Forms</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalForms}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Campaigns</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{activeForms}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-800">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Submissions</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{totalSubmissions}</h3>
          </div>
        </div>
      </div>

      {/* Job Forms List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Your Active Job Openings</h2>

        {forms.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 max-w-2xl mx-auto shadow-sm">
            <Inbox className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800">No recruitment forms built yet</h3>
            <p className="text-slate-500 text-sm mt-1 mb-6">Create your first custom form to start receiving applications from candidates.</p>
            <Link
              to="/forms/create"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-blue-100 transition-all text-sm"
            >
              <Plus className="w-4 h-4" /> Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div
                key={form._id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        form.isActive
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {form.isActive ? 'Active' : 'Draft/Inactive'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{form.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2 min-h-[2rem]">
                      {form.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{form.fields?.length || 0} Dynamic Fields</span>
                    <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-bold">
                      {form.submissionCount || 0} Submissions
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/forms/${form._id}/submissions`}
                      className="flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100"
                    >
                      <Users className="w-3.5 h-3.5" />
                      View Applicants
                    </Link>

                    <button
                      onClick={() => copyToClipboard(form.slug, form._id)}
                      className="flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 py-2 rounded-xl text-xs font-bold transition-all border border-slate-100"
                    >
                      {copiedId === form._id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <a
                      href={`/form/${form.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Form
                    </a>

                    <button
                      onClick={() => deleteForm(form._id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

import React from 'react';
import { Eye, Upload } from 'lucide-react';

const FormPreview = ({ title, description, fields }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden sticky top-24">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <Eye className="w-4 h-4 text-slate-400" />
        <span className="text-sm font-semibold text-slate-500">Live Preview</span>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            {title || 'Job Title Placeholder'}
          </h2>
          {description && (
            <p className="text-slate-500 text-sm mt-2 whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>

        {fields.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs italic">
            Form is empty. Add fields to see them here.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div key={field.id || idx} className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">
                  {field.label || 'Untitled Field'}
                  {field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>

                {field.type === 'Short Text' && (
                  <input
                    type="text"
                    disabled
                    placeholder="Candidate enters short answer..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed placeholder-slate-400 focus:outline-none"
                  />
                )}

                {field.type === 'Long Text' && (
                  <textarea
                    disabled
                    rows={3}
                    placeholder="Candidate enters detailed answer..."
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed placeholder-slate-400 focus:outline-none resize-none"
                  />
                )}

                {field.type === 'Dropdown' && (
                  <select
                    disabled
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 cursor-not-allowed text-slate-400 focus:outline-none"
                  >
                    <option value="">Select option...</option>
                    {field.options && field.options.map((opt, optIdx) => (
                      <option key={optIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === 'File Upload' && (
                  <div className="border border-dashed border-slate-200 bg-slate-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-not-allowed text-slate-400">
                    <Upload className="w-5 h-5 mb-1 text-slate-400" />
                    <span className="text-xs font-medium">Upload File (PDF, DOCX)</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Max 5MB</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPreview;

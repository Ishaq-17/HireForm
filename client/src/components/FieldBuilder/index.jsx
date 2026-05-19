import React, { useState } from 'react';
import { PlusCircle, Trash2, CheckSquare, Plus, X } from 'lucide-react';

const FieldBuilder = ({ fields, setFields }) => {
  const [newFieldType, setNewFieldType] = useState('Short Text');

  const addField = () => {
    const defaultLabels = {
      'Short Text': 'Full Name',
      'Long Text': 'Why do you want to join our team?',
      'Dropdown': 'Experience Level',
      'File Upload': 'Upload Resume'
    };

    const newField = {
      id: Date.now().toString(),
      label: defaultLabels[newFieldType] || 'New Field',
      type: newFieldType,
      required: false,
      options: newFieldType === 'Dropdown' ? ['Junior', 'Mid-level', 'Senior'] : []
    };
    setFields([...fields, newField]);
  };

  const removeField = (id) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateField = (id, updates) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const addOption = (fieldId) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    const newOption = `Option ${field.options.length + 1}`;
    updateField(fieldId, { options: [...field.options, newOption] });
  };

  const updateOption = (fieldId, optionIndex, val) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    const newOptions = [...field.options];
    newOptions[optionIndex] = val;
    updateField(fieldId, { options: newOptions });
  };

  const removeOption = (fieldId, optionIndex) => {
    const field = fields.find((f) => f.id === fieldId);
    if (!field) return;
    const newOptions = field.options.filter((_, idx) => idx !== optionIndex);
    updateField(fieldId, { options: newOptions });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-800">Form Fields ({fields.length})</h3>
        <div className="flex gap-2">
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Short Text">Short Text</option>
            <option value="Long Text">Long Text</option>
            <option value="Dropdown">Dropdown</option>
            <option value="File Upload">File Upload</option>
          </select>
          <button
            type="button"
            onClick={addField}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-md shadow-blue-100 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Field
          </button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-200/20">
          <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600">No fields added yet</p>
          <p className="text-xs text-slate-400 mt-1">Select a type and click "Add Field" to start customizing your application form.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, idx) => (
            <div
              key={field.id || idx}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                      Field Label
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g. Full Name"
                    />
                  </div>

                  <div className="flex items-end justify-between gap-4">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                        Field Type
                      </label>
                      <span className="inline-flex items-center px-3 py-2 border border-slate-100 bg-slate-50 rounded-lg text-sm text-slate-600 font-semibold w-full">
                        {field.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pb-2">
                      <input
                        type="checkbox"
                        id={`req-${field.id}`}
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`req-${field.id}`}
                        className="text-sm font-semibold text-slate-600 cursor-pointer select-none"
                      >
                        Required
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all self-start mt-4 md:mt-6"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Options Section for Dropdowns */}
              {field.type === 'Dropdown' && (
                <div className="pl-4 border-l-2 border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Dropdown Options
                    </span>
                    <button
                      type="button"
                      onClick={() => addOption(field.id)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Option
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {field.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg p-1.5">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => updateOption(field.id, optIdx, e.target.value)}
                          className="flex-1 min-w-0 bg-transparent border-none text-xs text-slate-700 focus:outline-none focus:ring-0 p-0"
                        />
                        <button
                          type="button"
                          onClick={() => removeOption(field.id, optIdx)}
                          className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FieldBuilder;

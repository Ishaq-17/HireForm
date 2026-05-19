import React from 'react';

const StatusBadge = ({ status }) => {
  const styles = {
    'New': 'bg-slate-100 text-slate-700 border-slate-200',
    'Reviewed': 'bg-blue-50 text-blue-700 border-blue-100',
    'Shortlisted': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Rejected': 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const currentStyle = styles[status] || styles['New'];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentStyle}`}>
      {status || 'New'}
    </span>
  );
};

export default StatusBadge;

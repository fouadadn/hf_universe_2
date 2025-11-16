import React from 'react';
import { CheckCircle } from 'lucide-react';

const Toast = ({ message, show }) => {
  return (
    <div className={`fixed bottom-5 right-5 bg-[#1a1d20] border border-gray-700 text-white px-6 py-3 rounded-xl shadow-2xl shadow-[#5c00cc50] flex items-center gap-3 transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <CheckCircle className="text-green-500" />
      <span>{message}</span>
    </div>
  );
};

export default Toast;
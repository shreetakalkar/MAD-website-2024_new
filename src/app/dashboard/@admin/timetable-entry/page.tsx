"use client"

import React from 'react';
import TimetableGenerator from '@/components/TimetableGenerator';

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <TimetableGenerator />
    </div>
  );
};

export default page;
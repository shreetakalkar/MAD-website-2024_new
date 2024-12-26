'use client';

import AssignmentSubmissionForm from '@/components/AssignmentForm';
import { useTheme } from 'next-themes';

const Home = () => {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === 'dark' ? 'bg-[#020817] text-white' : 'bg-white text-black'}`}>  
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md">
          <AssignmentSubmissionForm />
        </div>
      </main>
    </div>
  );
};

export default Home;

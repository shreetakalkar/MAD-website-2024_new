'use client';
import PreviousProfNotes from '@/components/ProfessorComponents/PreviousProfNotes';
import PreviousProfNotifications from '@/components/ProfessorComponents/PreviousProfNotifications';
import React, { useState } from 'react';

const HistoryPage = () => {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]"> {/* Adjust 64px based on your navbar height */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-100 p-6 overflow-y-auto">
          <nav>
            <ul className="flex flex-col space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`text-blue-600 hover:text-blue-800 ${activeTab === 'notifications' ? 'font-bold' : ''}`}
                >
                  Previous Notifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`text-blue-600 hover:text-blue-800 ${activeTab === 'notes' ? 'font-bold' : ''}`}
                >
                  Previous Notes
                </button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-hidden">
          <h1 className="text-3xl font-bold mb-6">{activeTab === 'notifications' ? 'Notification History' : 'Note History'}</h1>
          <div className="h-[calc(100%-4rem)] overflow-hidden"> {/* Adjust based on your h1 height */}
            {activeTab === 'notifications' && <PreviousProfNotifications />}
            {activeTab === 'notes' && <PreviousProfNotes />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
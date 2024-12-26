'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Student } from '@/constants/types/students';
import LeaderboardItem from './LeaderboardItem';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(db, 'AssignmentSubmissions');
        const studentsQuery = query(studentsCollection, orderBy('timeSubmitted', 'asc'));
        const querySnapshot = await getDocs(studentsQuery);

        const studentsData: Student[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          submissionTime: new Date(doc.data().timeSubmitted).getTime(),
        }));

        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#3B82F6]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#020817] rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-[#3B82F6]" />
          Student Leaderboard
        </h2>
      </div>
      <div className="p-6">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 mb-4 text-sm font-semibold text-gray-600 dark:text-gray-400 px-4">
          <div className="col-span-1">Rank</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-4">Submission Time</div>
          <div className="col-span-2 text-center">Medal</div>
        </div>
        {/* Items */}
        <div className="space-y-2">
          {students.map((student, index) => (
            <LeaderboardItem key={student.id} student={student} rank={index + 1} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

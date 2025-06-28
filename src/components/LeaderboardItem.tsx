import { Student } from '@/constants/types/students'
import { Trophy } from 'lucide-react'

interface LeaderboardItemProps {
  student: Student
  rank: number
}

const LeaderboardItem = ({ student, rank }: LeaderboardItemProps) => {
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-300 to-yellow-500' // Gold
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-400' // Silver
      case 3:
        return 'bg-gradient-to-r from-yellow-700 to-yellow-800' // Bronze
      default:
        return 'bg-[#3B82F6]'
    }
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className={`grid grid-cols-12 gap-4 p-4 rounded-lg transition-all duration-200 ${
      rank <= 3 
        ? 'bg-blue-50/50 dark:bg-blue-950/20' 
        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
    }`}>
      {/* Rank */}
      <div className="col-span-1">
        <div className={`w-8 h-8 rounded-full ${getMedalColor(rank)} flex items-center justify-center text-white font-bold`}>
          {rank}
        </div>
      </div>
      
      {/* Name */}
      <div className="col-span-5 flex items-center">
        <span className="font-medium text-gray-900 dark:text-white">
          {student.name}
        </span>
      </div>

      {/* Time */}
      <div className="col-span-4 flex items-center text-gray-600 dark:text-gray-400">
        {formatTime(student.submissionTime)}
      </div>

      {/* Medal */}
      <div className="col-span-2 flex items-center justify-center">
        {rank <= 3 && (
          <div className={`p-2 rounded-full ${getMedalColor(rank)}`}>
            <Trophy className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    </div>
  )
}

export default LeaderboardItem


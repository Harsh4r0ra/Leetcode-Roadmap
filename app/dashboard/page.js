'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { roadmapData } from '../../lib/roadmapData'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [progress, setProgress] = useState({})
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          router.push('/login')
          return
        }

        setUser(session.user)
        await fetchProgress(session.user.id)
      } catch (error) {
        console.error('Error getting session:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const fetchProgress = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('problem_id, completed')
        .eq('user_id', userId)

      if (error) {
        console.error('Error fetching progress:', error)
        return
      }

      const progressMap = {}
      data?.forEach(item => {
        progressMap[item.problem_id] = item.completed
      })
      
      setProgress(progressMap)
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const handleProgressChange = async (problemId, completed) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('progress')
        .upsert({
          user_id: user.id,
          problem_id: problemId,
          completed: completed
        }, {
          onConflict: 'user_id,problem_id'
        })

      if (error) {
        console.error('Error updating progress:', error)
        return
      }

      setProgress(prev => ({
        ...prev,
        [problemId]: completed
      }))
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const calculateStats = () => {
    const totalProblems = roadmapData.reduce((sum, topic) => sum + topic.problems.length, 0)
    const completedProblems = Object.values(progress).filter(Boolean).length
    const progressPercent = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0
    
    return { totalProblems, completedProblems, progressPercent }
  }

  const calculateTopicProgress = (topic) => {
    const completed = topic.problems.filter(problem => progress[problem.id]).length
    return topic.problems.length > 0 ? (completed / topic.problems.length) * 100 : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              🚀 Coding Interview Roadmap
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-white text-sm sm:text-base">
                Welcome, {user?.email?.split('@')[0]}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-white/90 text-lg">Track your progress through coding interview preparation</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 sm:gap-6 mb-8 flex-wrap">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center text-white border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold">{stats.totalProblems}</div>
            <div className="text-white/80 text-sm">Total Problems</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center text-white border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold">{stats.completedProblems}</div>
            <div className="text-white/80 text-sm">Completed</div>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 sm:p-6 text-center text-white border border-white/20">
            <div className="text-2xl sm:text-3xl font-bold">{stats.progressPercent}%</div>
            <div className="text-white/80 text-sm">Progress</div>
          </div>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapData.map((topic, topicIndex) => (
            <div key={topicIndex} className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{topic.title}</h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                  {topic.problems.length} problems
                </span>
              </div>

              <ul className="space-y-3">
                {topic.problems.map((problem, problemIndex) => (
                  <li key={problemIndex} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={progress[problem.id] || false}
                      onChange={(e) => handleProgressChange(problem.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <a
                      href={`https://leetcode.com/problems/${problem.url}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex-1 text-sm hover:text-blue-600 transition-colors ${
                        progress[problem.id] ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {problem.name}
                    </a>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      problem.difficulty === 'easy' 
                        ? 'bg-green-100 text-green-800'
                        : problem.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {problem.difficulty.toUpperCase()}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${calculateTopicProgress(topic)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-600 mt-1 text-center">
                  {Math.round(calculateTopicProgress(topic))}% Complete
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
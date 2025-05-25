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
        <div className="text-center mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
              🚀 Coding Interview Roadmap
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-white/90 text-sm sm:text-base">
                Welcome, {user?.email?.split('@')[0]}!
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-white/70 text-lg">Track your progress through coding interview preparation</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stats.totalProblems}</div>
            <div className="text-white/70">Total Problems</div>
          </div>
          <div className="card">
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stats.completedProblems}</div>
            <div className="text-white/70">Completed</div>
          </div>
          <div className="card">
            <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stats.progressPercent}%</div>
            <div className="text-white/70">Progress</div>
          </div>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmapData.map((topic, topicIndex) => (
            <div key={topicIndex} className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
                <span className="glass-effect px-3 py-1 rounded-full text-sm font-medium">
                  {topic.problems.length} problems
                </span>
              </div>

              <ul className="space-y-3">
                {topic.problems.map((problem, problemIndex) => (
                  <li key={problemIndex} className="glass-effect p-3 rounded-lg transition-all duration-300 hover:bg-white/15">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={progress[problem.id] || false}
                        onChange={(e) => handleProgressChange(problem.id, e.target.checked)}
                        className="w-4 h-4 text-primary-500 focus:ring-primary-500 border-white/20 rounded"
                      />
                      <a
                        href={`https://leetcode.com/problems/${problem.url}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex-1 text-sm hover:text-primary-400 transition-colors ${
                          progress[problem.id] ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {problem.name}
                      </a>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        problem.difficulty === 'easy' 
                          ? 'bg-green-500/20 text-green-400'
                          : problem.difficulty === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {problem.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                    style={{ width: `${calculateTopicProgress(topic)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-white/60 mt-2 text-center">
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
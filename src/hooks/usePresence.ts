import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { presenceSimulator } from '../simulation/mockPresence'

export function usePresence() {
  const tasks         = useTaskStore((state) => state.tasks)
  const setActiveUsers = useTaskStore((state) => state.setActiveUsers)
  const activeUsers   = useTaskStore((state) => state.activeUsers)

  useEffect(() => {
    // Get first 100 task ids for simulation
    // No need to use all 500
    const taskIds = tasks.slice(0, 100).map((t) => t.id)

    // Start simulation
    presenceSimulator.start(taskIds)

    // Subscribe to updates
    const unsubscribe = presenceSimulator.subscribe((users) => {
      setActiveUsers(users)
    })

    // Cleanup on unmount
    return () => {
      unsubscribe()
      presenceSimulator.stop()
    }
  }, [])

  // Get users watching a specific task
  function getUsersOnTask(taskId: string) {
    return activeUsers.filter((u) => u.taskId === taskId)
  }

  return { activeUsers, getUsersOnTask }
}
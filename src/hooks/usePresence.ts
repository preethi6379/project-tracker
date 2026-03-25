import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import { presenceSimulator } from '../simulation/mockPresence'

export function usePresence() {
  const tasks         = useTaskStore((state) => state.tasks)
  const setActiveUsers = useTaskStore((state) => state.setActiveUsers)
  const activeUsers   = useTaskStore((state) => state.activeUsers)

  useEffect(() => {
    const taskIds = tasks.slice(0, 100).map((t) => t.id)
    presenceSimulator.start(taskIds)
    const unsubscribe = presenceSimulator.subscribe((users) => {
      setActiveUsers(users)
    })
    return () => {
      unsubscribe()
      presenceSimulator.stop()
    }
  }, [])
  function getUsersOnTask(taskId: string) {
    return activeUsers.filter((u) => u.taskId === taskId)
  }

  return { activeUsers, getUsersOnTask }
}
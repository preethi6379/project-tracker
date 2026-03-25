import type { Task, User, Priority, Status } from '../types/task.types'
export const USERS: User[] = [
  { id: 'u1', name: 'Ravi Kumar',    initials: 'RK', color: '#6366f1' },
  { id: 'u2', name: 'Priya Sharma',  initials: 'PS', color: '#ec4899' },
  { id: 'u3', name: 'Arjun Mehta',   initials: 'AM', color: '#f59e0b' },
  { id: 'u4', name: 'Sneha Reddy',   initials: 'SR', color: '#10b981' },
  { id: 'u5', name: 'Kiran Patel',   initials: 'KP', color: '#3b82f6' },
  { id: 'u6', name: 'Divya Nair',    initials: 'DN', color: '#ef4444' },
]
const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low']
const STATUSES: Status[]     = ['todo', 'inprogress', 'inreview', 'done']
const VERBS   = ['Build', 'Fix', 'Design', 'Test', 'Review', 'Update', 'Deploy', 'Refactor', 'Write', 'Analyse']
const NOUNS   = ['Login Page', 'Dashboard', 'API', 'Database', 'UI Components', 'Auth Flow', 'Reports', 'Settings', 'Profile Page', 'Notifications']
function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}
function dateFromToday(offset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}
export function generateTasks(count: number = 500): Task[] {
  const tasks: Task[] = []

  for (let i = 1; i <= count; i++) {
    const title = `${randomItem(VERBS)} ${randomItem(NOUNS)}`
    const assignee = randomItem(USERS)
    const priority = randomItem(PRIORITIES)
    const status   = randomItem(STATUSES)
    const dueDateOffset  = Math.floor(Math.random() * 50) - 20
    const dueDate        = dateFromToday(dueDateOffset)
    const hasStartDate   = Math.random() > 0.2
    const startDate      = hasStartDate
      ? dateFromToday(dueDateOffset - Math.floor(Math.random() * 10))
      : ''

    tasks.push({
      id: `task-${i}`,
      title,
      assignee,
      priority,
      status,
      startDate,
      dueDate,
    })
  }

  return tasks
}
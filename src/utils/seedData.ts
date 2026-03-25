import type { Task, User, Priority, Status } from '../types/task.types'
//why import type:we are just importing the types not the actual values (optimisation)
// ─── 6 fixed users ───────────────────────────────────────────
// These are the people who can be assigned tasks
// We have exactly 6 users as the company asked
export const USERS: User[] = [
  { id: 'u1', name: 'Ravi Kumar',    initials: 'RK', color: '#6366f1' },
  { id: 'u2', name: 'Priya Sharma',  initials: 'PS', color: '#ec4899' },
  { id: 'u3', name: 'Arjun Mehta',   initials: 'AM', color: '#f59e0b' },
  { id: 'u4', name: 'Sneha Reddy',   initials: 'SR', color: '#10b981' },
  { id: 'u5', name: 'Kiran Patel',   initials: 'KP', color: '#3b82f6' },
  { id: 'u6', name: 'Divya Nair',    initials: 'DN', color: '#ef4444' },
]

// ─── possible values ─────────────────────────────────────────
const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low']
const STATUSES: Status[]     = ['todo', 'inprogress', 'inreview', 'done']

// ─── random task title words ──────────────────────────────────
// We mix these words to create random task titles
const VERBS   = ['Build', 'Fix', 'Design', 'Test', 'Review', 'Update', 'Deploy', 'Refactor', 'Write', 'Analyse']
const NOUNS   = ['Login Page', 'Dashboard', 'API', 'Database', 'UI Components', 'Auth Flow', 'Reports', 'Settings', 'Profile Page', 'Notifications']

// ─── helper functions ─────────────────────────────────────────

// Pick a random item from any array
//ithuku peru generic function
//<T> = i don't know the type,lets decide it later
//function randomUser(arr: User[]): User
//function randomPriority(arr: Priority[]): Priority(return type)
//function randomString(arr: string[]): string
//intha mathri witing diff func
// generic func = one func works for all types

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}// see to eg in note to know how it works

// Create a date string like "2026-03-15"
// offset = how many days from today (can be negative for past dates)
function dateFromToday(offset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return date.toISOString().split('T')[0]
}

// ─── main generator function ──────────────────────────────────
export function generateTasks(count: number = 500): Task[] {
  const tasks: Task[] = []

  for (let i = 1; i <= count; i++) {
    // Random title like "Build Login Page" or "Fix API"
    const title = `${randomItem(VERBS)} ${randomItem(NOUNS)}`

    // Random assignee from our 6 users
    const assignee = randomItem(USERS)

    // Random priority and status
    const priority = randomItem(PRIORITIES)
    const status   = randomItem(STATUSES)

    // Due date: some in past (overdue), some in future
    // Random between -20 days ago and +30 days from now
    const dueDateOffset  = Math.floor(Math.random() * 50) - 20
    const dueDate        = dateFromToday(dueDateOffset)

    // Start date: some tasks have no start date (null)
    // About 20% of tasks will have no start date
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
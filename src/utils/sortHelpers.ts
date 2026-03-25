import type { Task } from '../types/task.types'
export type SortDirection = 'asc' | 'desc'
export type SortField = 'title' | 'priority' | 'dueDate'
const PRIORITY_ORDER = {
  critical: 0,
  high:     1,
  medium:   2,
  low:      3,
}

export function sortTasks(
  tasks:     Task[],
  field:     SortField,
  direction: SortDirection
): Task[] {
  const sorted = [...tasks]

  sorted.sort((a, b) => {
    let comparison = 0

    if (field === 'title') {
      comparison = a.title.localeCompare(b.title)
    }

    if (field === 'priority') {
      comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    }

    if (field === 'dueDate') {
      comparison = a.dueDate.localeCompare(b.dueDate)
    }
    return direction === 'asc' ? comparison : -comparison
  })

  return sorted
}
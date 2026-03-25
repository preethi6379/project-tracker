import type { Task } from '../types/task.types'

// Sort direction — ascending or descending
export type SortDirection = 'asc' | 'desc'

// Which column is being sorted
export type SortField = 'title' | 'priority' | 'dueDate'

// Priority order — critical is most urgent so comes first
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
  // Make a copy so we don't mutate original array
  const sorted = [...tasks]

  sorted.sort((a, b) => {
    let comparison = 0

    if (field === 'title') {
      // Alphabetical sort
      comparison = a.title.localeCompare(b.title)
    }

    if (field === 'priority') {
      // Sort by priority order defined above
      comparison = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    }

    if (field === 'dueDate') {
      // Sort by date string — works because format is YYYY-MM-DD
      comparison = a.dueDate.localeCompare(b.dueDate)
    }

    // If direction is desc, flip the comparison
    return direction === 'asc' ? comparison : -comparison
  })

  return sorted
}
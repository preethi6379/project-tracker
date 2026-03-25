// Get today's date as a string like "2026-03-24"
export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

// Check if a date is in the past
export function isOverdue(dueDate: string): boolean {
  return dueDate < getToday()
}

// Check if due date is today
export function isDueToday(dueDate: string): boolean {
  return dueDate === getToday()
}

// How many days ago was the due date?
export function daysOverdue(dueDate: string): number {
  const due   = new Date(dueDate)
  const today = new Date()
  const diff  = today.getTime() - due.getTime()
  // Convert milliseconds to days
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Format date nicely like "Mar 25"
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  })
}

// Show smart due date label
// - "Due Today" if due today
// - "X days overdue" if overdue by 7+ days
// - red date if overdue
// - normal date otherwise
export function getDueDateLabel(dueDate: string): {
  label: string
  isOverdue: boolean
  isCritical: boolean
} {
  if (isDueToday(dueDate)) {
    return { label: 'Due Today', isOverdue: false, isCritical: false }
  }

  const days = daysOverdue(dueDate)

  if (days > 7) {
    return { label: `${days} days overdue`, isOverdue: true, isCritical: true }
  }

  if (days > 0) {
    return { label: formatDate(dueDate), isOverdue: true, isCritical: false }
  }

  return { label: formatDate(dueDate), isOverdue: false, isCritical: false }
}
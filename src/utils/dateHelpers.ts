
export function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export function isOverdue(dueDate: string): boolean {
  return dueDate < getToday()
}
export function isDueToday(dueDate: string): boolean {
  return dueDate === getToday()
}
export function daysOverdue(dueDate: string): number {
  const due   = new Date(dueDate)
  const today = new Date()
  const diff  = today.getTime() - due.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
  })
}

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
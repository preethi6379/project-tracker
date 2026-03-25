// This describes what a USER looks like
export type User = {
  id: string        // unique id like "user-1"
  name: string      // full name like "Ravi Kumar"
  initials: string  // short like "RK" shown on avatar
  color: string     // avatar background color
}

// Priority levels a task can have
export type Priority = 'critical' | 'high' | 'medium' | 'low'

// The 4 columns in Kanban board
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done'

// This describes what a TASK looks like
export type Task = {
  id: string           // unique id like "task-1"
  title: string        // name of the task
  assignee: User       // which user is assigned
  priority: Priority   // critical / high / medium / low
  status: Status       // which column it belongs to
  startDate: string    // when task starts "2026-03-01"
  dueDate: string      // deadline "2026-03-25"
}

// This describes what FILTERS look like
export type Filters = {
  status: Status[]       // can select multiple statuses
  priority: Priority[]   // can select multiple priorities
  assignees: string[]    // list of user ids
  dateFrom: string       // filter from this date
  dateTo: string         // filter to this date
}
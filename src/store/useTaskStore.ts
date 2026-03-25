import { create } from 'zustand'
import type { Task, Filters, Status } from '../types/task.types'
import { generateTasks } from '../utils/seedData'
import type { ActiveUser } from '../simulation/mockPresence'

type TaskStore = {
  // ── DATA ──────────────────────────────────────────
  tasks: Task[]

  // ── ACTIVE VIEW ───────────────────────────────────
  activeView: 'kanban' | 'list' | 'timeline'
  setActiveView: (view: 'kanban' | 'list' | 'timeline') => void

  // ── FILTERS ───────────────────────────────────────
  filters: Filters
  setFilters: (filters: Partial<Filters>) => void
  clearFilters: () => void

  // ── TASK ACTIONS ──────────────────────────────────
  updateTaskStatus: (taskId: string, newStatus: Status) => void

  // ── PRESENCE ──────────────────────────────────────
  activeUsers:    ActiveUser[]
  setActiveUsers: (users: ActiveUser[]) => void
}

const defaultFilters: Filters = {
  status:    [],
  priority:  [],
  assignees: [],
  dateFrom:  '',
  dateTo:    '',
}

export const useTaskStore = create<TaskStore>((set) => ({

  tasks:      generateTasks(500),

  activeView:    'kanban',
  setActiveView: (view) => set({ activeView: view }),

  filters:     defaultFilters,
  setFilters:  (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () => set({ filters: defaultFilters }),

  updateTaskStatus: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      ),
    })),

  // ── Presence ──────────────────────────────────────
  activeUsers:    [],
  setActiveUsers: (users) => set({ activeUsers: users }),

}))

export function getFilteredTasks(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter((task) => {
    if (filters.status.length > 0 && !filters.status.includes(task.status))
      return false
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority))
      return false
    if (filters.assignees.length > 0 && !filters.assignees.includes(task.assignee.id))
      return false
    if (filters.dateFrom && task.dueDate < filters.dateFrom)
      return false
    if (filters.dateTo && task.dueDate > filters.dateTo)
      return false
    return true
  })
}
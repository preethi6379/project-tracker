import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import type { Status, Priority } from '../types/task.types'

export function useUrlFilters() {
  const filters     = useTaskStore((state) => state.filters)
  const setFilters  = useTaskStore((state) => state.setFilters)
  const clearFilters = useTaskStore((state) => state.clearFilters)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const status    = params.get('status')
    const priority  = params.get('priority')
    const assignees = params.get('assignees')
    const dateFrom  = params.get('dateFrom') ?? ''
    const dateTo    = params.get('dateTo')   ?? ''
    if (status || priority || assignees || dateFrom || dateTo) {
      setFilters({
        status:    status    ? status.split(',')    as Status[]   : [],
        priority:  priority  ? priority.split(',')  as Priority[] : [],
        assignees: assignees ? assignees.split(',')               : [],
        dateFrom,
        dateTo,
      })
    }
  }, [])
  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.status.length > 0)
      params.set('status',    filters.status.join(','))

    if (filters.priority.length > 0)
      params.set('priority',  filters.priority.join(','))

    if (filters.assignees.length > 0)
      params.set('assignees', filters.assignees.join(','))

    if (filters.dateFrom)
      params.set('dateFrom',  filters.dateFrom)

    if (filters.dateTo)
      params.set('dateTo',    filters.dateTo)
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState(null, '', newUrl)

  }, [filters])

  return { filters, setFilters, clearFilters }
}
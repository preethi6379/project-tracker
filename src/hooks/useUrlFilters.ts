import { useEffect } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import type { Filters, Status, Priority } from '../types/task.types'

export function useUrlFilters() {
  const filters     = useTaskStore((state) => state.filters)
  const setFilters  = useTaskStore((state) => state.setFilters)
  const clearFilters = useTaskStore((state) => state.clearFilters)

  // ── On app load — read filters from URL ──────────
  // e.g. ?status=todo,inprogress&priority=critical
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const status    = params.get('status')
    const priority  = params.get('priority')
    const assignees = params.get('assignees')
    const dateFrom  = params.get('dateFrom') ?? ''
    const dateTo    = params.get('dateTo')   ?? ''

    // Only update if URL has filter params
    if (status || priority || assignees || dateFrom || dateTo) {
      setFilters({
        // Split comma separated values into arrays
        // e.g. "todo,inprogress" → ["todo", "inprogress"]
        status:    status    ? status.split(',')    as Status[]   : [],
        priority:  priority  ? priority.split(',')  as Priority[] : [],
        assignees: assignees ? assignees.split(',')               : [],
        dateFrom,
        dateTo,
      })
    }
  // Only run once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── When filters change — update URL ─────────────
  useEffect(() => {
    const params = new URLSearchParams()

    // Only add to URL if filter has values
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

    // Update URL without reloading the page
    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState(null, '', newUrl)

  }, [filters])

  return { filters, setFilters, clearFilters }
}
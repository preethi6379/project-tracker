import { useUrlFilters } from '../hooks/useUrlFilters'
import MultiSelect from './MultiSelect'
import { USERS } from '../utils/seedData'
import type { Status, Priority } from '../types/task.types'

// Status options for dropdown
const STATUS_OPTIONS = [
  { value: 'todo',       label: 'To Do'       },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'inreview',   label: 'In Review'   },
  { value: 'done',       label: 'Done'        },
]

// Priority options with colours
const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical', color: '#ef4444' },
  { value: 'high',     label: 'High',     color: '#f97316' },
  { value: 'medium',   label: 'Medium',   color: '#eab308' },
  { value: 'low',      label: 'Low',      color: '#22c55e' },
]

// Assignee options from our 6 users
const ASSIGNEE_OPTIONS = USERS.map((u) => ({
  value: u.id,
  label: u.name,
  color: u.color,
}))

export default function FilterBar() {
  const { filters, setFilters, clearFilters } = useUrlFilters()

  // Check if any filter is active
  const hasActiveFilters =
    filters.status.length    > 0 ||
    filters.priority.length  > 0 ||
    filters.assignees.length > 0 ||
    filters.dateFrom !== ''       ||
    filters.dateTo   !== ''

  return (
    <div className="flex items-center gap-2 px-4 py-3 bg-white border-b border-gray-200 flex-wrap">

      {/* ── Status filter ── */}
      <MultiSelect
        label="Status"
        options={STATUS_OPTIONS}
        selected={filters.status}
        onChange={(values) =>
          setFilters({ status: values as Status[] })
        }
      />

      {/* ── Priority filter ── */}
      <MultiSelect
        label="Priority"
        options={PRIORITY_OPTIONS}
        selected={filters.priority}
        onChange={(values) =>
          setFilters({ priority: values as Priority[] })
        }
      />

      {/* ── Assignee filter ── */}
      <MultiSelect
        label="Assignee"
        options={ASSIGNEE_OPTIONS}
        selected={filters.assignees}
        onChange={(values) =>
          setFilters({ assignees: values })
        }
      />

      {/* ── Date range ── */}
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-400 font-medium">From</span>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ dateFrom: e.target.value })}
          className="
            text-xs border border-gray-200 rounded-lg px-2 py-2
            text-gray-600 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-300
            hover:border-gray-300
          "
        />
        <span className="text-xs text-gray-400 font-medium">To</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ dateTo: e.target.value })}
          className="
            text-xs border border-gray-200 rounded-lg px-2 py-2
            text-gray-600 cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-indigo-300
            hover:border-gray-300
          "
        />
      </div>

      {/* ── Clear all button ── */}
      {/* Only shows when at least one filter is active */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="
            flex items-center gap-1 px-3 py-2 rounded-lg
            text-sm text-red-500 border border-red-200
            hover:bg-red-50 transition-colors ml-auto
          "
        >
          ✕ Clear all
        </button>
      )}

    </div>
  )
}
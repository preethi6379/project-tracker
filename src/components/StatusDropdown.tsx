import type { Status } from '../types/task.types'
import { useTaskStore } from '../store/useTaskStore'

type Props = {
  taskId:        string
  currentStatus: Status
}

// Each status has a label and colour
const STATUS_CONFIG: Record<Status, { label: string; style: string }> = {
  todo:       { label: 'To Do',       style: 'bg-gray-100    text-gray-600'   },
  inprogress: { label: 'In Progress', style: 'bg-blue-100    text-blue-600'   },
  inreview:   { label: 'In Review',   style: 'bg-yellow-100  text-yellow-700' },
  done:       { label: 'Done',        style: 'bg-green-100   text-green-700'  },
}

const ALL_STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done']

export default function StatusDropdown({ taskId, currentStatus }: Props) {
  const updateTaskStatus = useTaskStore(
    (state) => state.updateTaskStatus
  )

  const config = STATUS_CONFIG[currentStatus]

  return (
    // Native select styled to look like a badge
    <select
      value={currentStatus}
      onChange={(e) => updateTaskStatus(taskId, e.target.value as Status)}
      className={`
        text-xs font-medium px-2 py-1 rounded-full
        border-0 cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-indigo-300
        ${config.style}
      `}
    >
      {ALL_STATUSES.map((status) => (
        <option key={status} value={status}>
          {STATUS_CONFIG[status].label}
        </option>
      ))}
    </select>
  )
}
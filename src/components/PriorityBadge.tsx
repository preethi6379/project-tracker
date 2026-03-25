import type { Priority } from '../types/task.types'

type Props = {
  priority: Priority
}

// Each priority gets its own colour
const STYLES: Record<Priority, string> = {
  critical: 'bg-red-100    text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-yellow-100 text-yellow-700',
  low:      'bg-green-100  text-green-700',
}

export default function PriorityBadge({ priority }: Props) {
  return (
    <span className={`
      text-xs font-medium px-2 py-0.5 rounded-full capitalize
      ${STYLES[priority]}
    `}>
      {priority}
    </span>
  )
}
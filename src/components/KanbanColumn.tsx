import type { Task, Status } from '../types/task.types'
import TaskCard from './TaskCard'

type Props = {
  status:      Status
  tasks:       Task[]
  draggingId:  string | null
  overStatus:  Status | null
  onDragStart: (e: React.PointerEvent, taskId: string, status: Status) => void
  onDragMove:  (e: React.PointerEvent) => void
  onDragEnd:   (e: React.PointerEvent) => void
}

const COLUMN_CONFIG: Record<Status, {
  label:   string
  dot:     string
  empty:   string
  topBar:  string
  title:   string
  count:   string
}> = {
  todo: {
    label:  'To Do',
    dot:    'bg-gray-400',
    empty:  '📋',
    topBar: 'bg-gray-400',
    title:  'text-gray-700',
    count:  'bg-gray-100 text-gray-500',
  },
  inprogress: {
    label:  'In Progress',
    dot:    'bg-blue-400',
    empty:  '⚙️',
    topBar: 'bg-blue-400',
    title:  'text-blue-700',
    count:  'bg-blue-50 text-blue-500',
  },
  inreview: {
    label:  'In Review',
    dot:    'bg-amber-400',
    empty:  '👀',
    topBar: 'bg-amber-400',
    title:  'text-amber-700',
    count:  'bg-amber-50 text-amber-500',
  },
  done: {
    label:  'Done',
    dot:    'bg-green-400',
    empty:  '✅',
    topBar: 'bg-green-400',
    title:  'text-green-700',
    count:  'bg-green-50 text-green-600',
  },
}

export default function KanbanColumn({
  status,
  tasks,
  draggingId,
  overStatus,
  onDragStart,
  onDragMove,
  onDragEnd,
}: Props) {
  const config = COLUMN_CONFIG[status]
  const isOver = overStatus === status

  return (
    <div
      data-status={status}
      className={`
        flex flex-col rounded-2xl
        border transition-all duration-200
        flex-1 min-w-[240px] max-w-[320px]
        h-full overflow-hidden
        ${isOver
          ? 'bg-indigo-50 border-indigo-200 shadow-xl scale-[1.01]'
          : 'bg-white border-gray-200 shadow-sm'
        }
      `}
    >

      <div className={`h-1.5 w-full rounded-t-2xl ${config.topBar}`} />

      
      <div className={`
        flex items-center justify-center gap-2
        px-4 py-3 border-b
        ${isOver ? 'border-indigo-200 bg-indigo-50' : 'border-gray-100 bg-white'}
      `}>
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <h3 className={`
          text-sm font-bold tracking-wide
          ${isOver ? 'text-indigo-700' : config.title}
        `}>
          {config.label}
        </h3>
        <span className={`
          text-xs font-semibold px-2 py-0.5 rounded-full
          ${isOver ? 'bg-indigo-100 text-indigo-600' : config.count}
        `}>
          {tasks.length}
        </span>
      </div>

      
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">

      
        {tasks.length === 0 && !isOver && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-300 py-10">
            <div className="text-4xl">{config.empty}</div>
            <p className="text-xs font-medium">No tasks here</p>
          </div>
        )}

      
        {tasks.length === 0 && isOver && (
          <div className="
            flex flex-col items-center justify-center
            h-full py-10 gap-2
            border-2 border-dashed border-indigo-300
            rounded-xl text-indigo-400
          ">
            <div className="text-2xl">+</div>
            <p className="text-xs font-medium">Drop here</p>
          </div>
        )}

      
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            isDragging={draggingId === task.id}
            onDragStart={(e) => onDragStart(e, task.id, status)}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  )
}
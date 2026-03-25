import type { Task } from '../types/task.types'
import PriorityBadge from './PriorityBadge'
import AvatarStack from './AvatarStack'
import { getDueDateLabel } from '../utils/dateHelpers'
import { useTaskStore } from '../store/useTaskStore'

type Props = {
  task:        Task
  isDragging:  boolean
  onDragStart: (e: React.PointerEvent) => void
  onDragMove:  (e: React.PointerEvent) => void
  onDragEnd:   (e: React.PointerEvent) => void
}

export default function TaskCard({
  task,
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
}: Props) {
  const dateInfo    = getDueDateLabel(task.dueDate)
  const activeUsers = useTaskStore((state) => state.activeUsers)

  // Users currently viewing THIS specific card
  const viewingUsers = activeUsers.filter((u) => u.taskId === task.id)
  const isBeingViewed = viewingUsers.length > 0

  // ── Placeholder shown where card was grabbed ──
  if (isDragging) {
    return (
      <div
        className="
          rounded-xl border-2 border-dashed
          border-indigo-300 bg-indigo-50
          flex flex-col items-center
          justify-center gap-1 py-4
        "
        style={{ minHeight: '90px' }}
      >
        <div className="text-indigo-300 text-xl">⤢</div>
        <p className="text-xs text-indigo-300 font-medium">
          Drop here
        </p>
      </div>
    )
  }

  return (
    <div
      onPointerDown={onDragStart}
      onPointerMove={onDragMove}
      onPointerUp={onDragEnd}
      className={`
        bg-white rounded-xl p-3
        border transition-all duration-200
        cursor-grab active:cursor-grabbing
        select-none group
        ${isBeingViewed
          ? 'border-indigo-200 shadow-lg ring-2 ring-indigo-100'
          : 'border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200'
        }
      `}
    >

      {/* ── Priority colour bar at top ── */}
      <div className={`
        h-1 w-full rounded-full mb-2
        ${task.priority === 'critical' ? 'bg-red-400'    :
          task.priority === 'high'     ? 'bg-orange-400' :
          task.priority === 'medium'   ? 'bg-yellow-400' :
          'bg-green-400'}
      `}/>

      {/* ── Presence indicator bar ── */}
      {/* Shows when someone is viewing this card */}
      {isBeingViewed && (
        <div className="
          flex items-center gap-1 mb-2
          bg-indigo-50 rounded-lg px-2 py-1
        ">
          <span className="text-[10px] text-indigo-400 animate-pulse">
            👁
          </span>
          <span className="text-[10px] text-indigo-500 font-medium">
            {viewingUsers.length === 1
              ? `${viewingUsers[0].name} is viewing`
              : `${viewingUsers.length} people viewing`
            }
          </span>
        </div>
      )}

      {/* ── Task title ── */}
      <p className="text-sm font-medium text-gray-900 mb-2 leading-snug">
        {task.title}
      </p>

      {/* ── Priority badge ── */}
      <div className="mb-3">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* ── Bottom row — avatar + presence + due date ── */}
      <div className="flex items-center justify-between">

        {/* Left side — assignee + viewers */}
        <div className="flex items-center gap-1">

          {/* Assignee avatar */}
          <div
            title={task.assignee.name}
            className="
              w-7 h-7 rounded-full flex items-center
              justify-center text-white text-xs font-bold
              ring-2 ring-white shadow-sm shrink-0
            "
            style={{ backgroundColor: task.assignee.color }}
          >
            {task.assignee.initials}
          </div>

          {/* Viewing users avatars */}
          {isBeingViewed && (
            <AvatarStack users={viewingUsers} />
          )}
        </div>

        {/* Right side — due date */}
        <span className={`
          text-xs px-2 py-0.5 rounded-full whitespace-nowrap
          ${dateInfo.isCritical
            ? 'bg-red-100 text-red-600 font-medium'   :
            dateInfo.isOverdue
            ? 'bg-orange-50 text-orange-500'           :
            dateInfo.label === 'Due Today'
            ? 'bg-blue-50 text-blue-600 font-medium'   :
            'text-gray-400'
          }
        `}>
          {dateInfo.label}
        </span>

      </div>
    </div>
  )
}
import { useTaskStore, getFilteredTasks } from '../store/useTaskStore'
import KanbanColumn from '../components/KanbanColumn'
import DragGhost from '../components/DragGhost'
import { useDragDrop } from '../hooks/useDragDrop'
import type { Status } from '../types/task.types'

const STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done']

export default function KanbanView() {
  const tasks   = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)

  const filteredTasks = getFilteredTasks(tasks, filters)

  const {
    dragState,
    overStatus,
    ghostRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  } = useDragDrop()

  const draggingTask = dragState
    ? tasks.find((t) => t.id === dragState.taskId) ?? null
    : null

  return (
    <div
      className="h-full flex flex-col"
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
    >
      {/* Columns — take full height */}
      <div className="
        flex-1 flex gap-3
        overflow-x-auto overflow-y-hidden
        pb-2
      ">
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter((t) => t.status === status)}
            draggingId={dragState?.taskId ?? null}
            overStatus={overStatus}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      <DragGhost ref={ghostRef} task={draggingTask} />
    </div>
  )
}
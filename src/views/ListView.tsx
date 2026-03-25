import { useState } from 'react'
import { useTaskStore, getFilteredTasks } from '../store/useTaskStore'
import { sortTasks } from '../utils/sortHelpers'
import type { SortField, SortDirection } from '../utils/sortHelpers'
import PriorityBadge from '../components/PriorityBadge'
import StatusDropdown from '../components/StatusDropdown'
import { getDueDateLabel } from '../utils/dateHelpers'
import { useVirtualScroll } from '../hooks/useVirtualScroll'

const ROW_HEIGHT = 56

export default function ListView() {
  const tasks   = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)

  const [sortField,     setSortField]     = useState<SortField>('dueDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const filteredTasks = getFilteredTasks(tasks, filters)
  const sortedTasks   = sortTasks(filteredTasks, sortField, sortDirection)

  const {
    containerRef,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
  } = useVirtualScroll({
    totalItems: sortedTasks.length,
    itemHeight: ROW_HEIGHT,
    bufferSize: 5,
  })

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDirection((prev) => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }
  function SortArrow({ field }: { field: SortField }) {
    const isActive = sortField === field
    return (
      <span className={`
        inline-flex items-center justify-center
        w-5 h-5 rounded-full ml-2
        text-[10px] font-bold transition-all duration-150
        ${isActive
          ? 'bg-indigo-500 text-white'
          : 'bg-gray-100 text-gray-400'
        }
      `}>
        {!isActive && '⌄'}
        {isActive && sortDirection === 'asc'  && '˄'}
        {isActive && sortDirection === 'desc' && '˅'}
      </span>
    )
  }

  const visibleTasks = sortedTasks.slice(startIndex, endIndex + 1)

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
      style={{ height: 'calc(100vh - 180px)' }}
    >
      <div className="flex items-center bg-gray-50 border-b border-gray-200 shrink-0 text-sm">

        <div
          onClick={() => handleSort('title')}
          className="w-[35%] px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 select-none flex items-center transition-colors"
        >
          Title <SortArrow field="title" />
        </div>

        <div className="w-[20%] px-4 py-3 font-semibold text-gray-600">
          Assignee
        </div>

        <div
          onClick={() => handleSort('priority')}
          className="w-[15%] px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 select-none flex items-center transition-colors"
        >
          Priority <SortArrow field="priority" />
        </div>

        <div className="w-[15%] px-4 py-3 font-semibold text-gray-600">
          Status
        </div>

        <div
          onClick={() => handleSort('dueDate')}
          className="w-[15%] px-4 py-3 font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 select-none flex items-center transition-colors"
        >
          Due Date <SortArrow field="dueDate" />
        </div>

      </div>
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
      >
        {sortedTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400">
            <div className="text-4xl">🔍</div>
            <p className="font-medium">No tasks found</p>
            <p className="text-xs">Try clearing your filters</p>
          </div>
        )}
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div style={{ position: 'absolute', top: `${offsetY}px`, left: 0, right: 0 }}>

            {visibleTasks.map((task, i) => {
              const dateInfo    = getDueDateLabel(task.dueDate)
              const globalIndex = startIndex + i

              return (
                <div
                  key={task.id}
                  style={{ height: `${ROW_HEIGHT}px` }}
                  className={`
                    flex items-center border-b border-gray-100
                    hover:bg-indigo-50/40 transition-colors
                    ${globalIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  `}
                >
                  <div className="w-[35%] px-4 font-medium text-gray-900 text-sm">
                    <span className="truncate block">{task.title}</span>
                  </div>
                  <div className="w-[20%] px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ backgroundColor: task.assignee.color }}
                      >
                        {task.assignee.initials}
                      </div>
                      <span className="text-gray-600 text-xs whitespace-nowrap">
                        {task.assignee.name}
                      </span>
                    </div>
                  </div>
                  <div className="w-[15%] px-4">
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="w-[15%] px-4">
                    <StatusDropdown
                      taskId={task.id}
                      currentStatus={task.status}
                    />
                  </div>
                  <div className="w-[15%] px-4">
                    <span className={`
                      text-xs px-2 py-1 rounded-full
                      ${dateInfo.isCritical
                        ? 'bg-red-100 text-red-600 font-medium'
                        : dateInfo.isOverdue
                        ? 'bg-orange-50 text-orange-500'
                        : dateInfo.label === 'Due Today'
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-500'
                      }
                    `}>
                      {dateInfo.label}
                    </span>
                  </div>

                </div>
              )
            })}

          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 shrink-0 flex items-center gap-2">
        <span>Showing <strong>{sortedTasks.length}</strong> tasks</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-400">{endIndex - startIndex + 1} rendered in DOM</span>
      </div>

    </div>
  )
}
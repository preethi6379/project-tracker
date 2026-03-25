import { useRef, useCallback } from 'react'
import { useTaskStore, getFilteredTasks } from '../store/useTaskStore'
import { getToday } from '../utils/dateHelpers'

const ROW_HEIGHT    = 40
const DAY_WIDTH     = 38
const SIDEBAR_WIDTH = 200

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const PRIORITY_COLORS: Record<string, { bg: string; text: string }> = {
  critical: { bg: '#ef4444', text: 'white' },
  high:     { bg: '#f97316', text: 'white' },
  medium:   { bg: '#eab308', text: 'white' },
  low:      { bg: '#22c55e', text: 'white' },
}

export default function TimelineView() {
  const tasks   = useTaskStore((state) => state.tasks)
  const filters = useTaskStore((state) => state.filters)

  const filteredTasks = getFilteredTasks(tasks, filters)
  const today         = getToday()

  // Refs for synced scrolling
  const sidebarRef  = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // When timeline scrolls vertically — sync sidebar
  const handleTimelineScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTop = (e.target as HTMLDivElement).scrollTop
    }
  }, [])

  // When sidebar scrolls — sync timeline
  const handleSidebarScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (timelineRef.current) {
      timelineRef.current.scrollTop = (e.target as HTMLDivElement).scrollTop
    }
  }, [])

  const now         = new Date()
  const year        = now.getFullYear()
  const month       = now.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days        = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const timelineWidth = daysInMonth * DAY_WIDTH

  const todayDay = new Date(today).getDate()
  const todayX   = (todayDay - 1) * DAY_WIDTH + DAY_WIDTH / 2

  function dateToDayNumber(dateStr: string): number | null {
    if (!dateStr) return null
    const date = new Date(dateStr)
    if (date.getFullYear() !== year || date.getMonth() !== month) {
      if (date < new Date(year, month, 1))     return 0
      if (date > new Date(year, month + 1, 0)) return daysInMonth + 1
    }
    return date.getDate()
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col"
      style={{ height: 'calc(100vh - 180px)' }}
    >

      {/* ── Month + Year Title + Legend ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-bold text-gray-800">
            {MONTH_NAMES[month]} {year}
          </h2>
          <span className="text-xs bg-blue-100 text-red-600 font-medium px-2 py-0.5 rounded-full">
            Today: {todayDay} {MONTH_NAMES[month]}
          </span>
        </div>

        {/* Priority legend */}
        <div className="flex items-center gap-3">
          {Object.entries(PRIORITY_COLORS).map(([p, c]) => (
            <div key={p} className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: c.bg }}
              />
              <span className="text-xs text-gray-500 capitalize">{p}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Day numbers header ── */}
      <div className="flex border-b border-gray-200 bg-gray-50 shrink-0">

        {/* Sidebar label */}
        <div
          className="shrink-0 px-4 py-2 font-semibold text-gray-500 text-xs border-r border-gray-200 flex items-center"
          style={{ width: SIDEBAR_WIDTH }}
        >
          TASK
        </div>

        {/* Day numbers — matches timeline scroll */}
        <div className="overflow-x-hidden flex-1">
          <div className="flex" style={{ width: timelineWidth }}>
            {days.map((day) => {
              const dateStr   = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const isToday   = dateStr === today
              const dayOfWeek = new Date(dateStr).getDay()
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

              return (
                <div
                  key={day}
                  style={{ width: DAY_WIDTH, minWidth: DAY_WIDTH }}
                  className={`
                    text-center py-2 text-xs border-r border-gray-100
                    ${isToday
                      ? 'bg-red-50 text-red-600 font-bold'
                      : isWeekend
                      ? 'bg-gray-100 text-gray-400'
                      : 'text-gray-400'
                    }
                  `}
                >
                  {day}
                  <div className="text-[9px] mt-0.5 opacity-60">
                    {['Su','Mo','Tu','We','Th','Fr','Sa'][dayOfWeek]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main area ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar — synced scroll ── */}
        <div
          ref={sidebarRef}
          onScroll={handleSidebarScroll}
          className="shrink-0 border-r border-gray-200 overflow-y-auto"
          style={{
            width: SIDEBAR_WIDTH,
            // Hide scrollbar visually but keep functional
            scrollbarWidth: 'none',
          }}
        >
          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-300">
              <div className="text-3xl">📅</div>
              <p className="text-xs">No tasks</p>
            </div>
          )}

          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{ height: ROW_HEIGHT }}
              className="flex items-center gap-2 px-3 border-b border-gray-100 hover:bg-gray-50 transition-colors shrink-0"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{ backgroundColor: task.assignee.color }}
              >
                {task.assignee.initials}
              </div>
              <span className="text-xs text-gray-700 truncate">
                {task.title}
              </span>
            </div>
          ))}
        </div>

        {/* ── Timeline — scrolls both X and Y ── */}
        <div
          ref={timelineRef}
          onScroll={handleTimelineScroll}
          className="flex-1 overflow-auto"
        >
          <div style={{ width: timelineWidth, position: 'relative' }}>

            {/* ── Today line — bold red ── */}
            <div
              style={{
                position:   'absolute',
                left:       todayX,
                top:        0,
                bottom:     0,
                width:      '2px',
                zIndex:     20,
                background: '#3b82f6',
                // Make line full height of all tasks
                minHeight:  filteredTasks.length * ROW_HEIGHT,
              }}
            >
              {/* Triangle marker at top */}
              <div style={{
                position:    'absolute',
                top:         0,
                left:        '50%',
                transform:   'translateX(-50%)',
                width:       0,
                height:      0,
                borderLeft:  '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop:   '8px solid #3b82f6',
              }}/>
            </div>

            {/* ── Task rows ── */}
            {filteredTasks.map((task, index) => {
              const startDay = dateToDayNumber(task.startDate)
              const endDay   = dateToDayNumber(task.dueDate)
              const color    = PRIORITY_COLORS[task.priority]

              const hasBar = task.startDate &&
                             startDay !== null &&
                             endDay   !== null &&
                             endDay > 0 &&
                             startDay <= daysInMonth

              const hasDot = !task.startDate &&
                             endDay !== null &&
                             endDay > 0 &&
                             endDay <= daysInMonth

              const barStartDay = Math.max(1, startDay ?? 1)
              const barEndDay   = Math.min(daysInMonth, endDay ?? daysInMonth)
              const barLeft     = (barStartDay - 1) * DAY_WIDTH
              const barWidth    = Math.max(
                DAY_WIDTH,
                (barEndDay - barStartDay + 1) * DAY_WIDTH
              )
              const dotLeft = ((endDay ?? 1) - 1) * DAY_WIDTH + DAY_WIDTH / 2

              return (
                <div
                  key={task.id}
                  style={{ height: ROW_HEIGHT, position: 'relative' }}
                  className={`
                    border-b border-gray-100
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}
                  `}
                >
                  {/* Weekend shading */}
                  {days.map((day) => {
                    const dow = new Date(
                      `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                    ).getDay()
                    if (dow !== 0 && dow !== 6) return null
                    return (
                      <div
                        key={day}
                        style={{
                          position: 'absolute',
                          left:     (day - 1) * DAY_WIDTH,
                          top:      0,
                          width:    DAY_WIDTH,
                          height:   '100%',
                        }}
                        className="bg-gray-100/70"
                      />
                    )
                  })}

                  {/* ── Bar ── */}
                  {hasBar && (
                    <div
                      style={{
                        position:        'absolute',
                        left:            barLeft + 3,
                        top:             '50%',
                        transform:       'translateY(-50%)',
                        width:           barWidth - 6,
                        height:          22,
                        backgroundColor: color.bg,
                        borderRadius:    999,
                        display:         'flex',
                        alignItems:      'center',
                        paddingLeft:     8,
                        paddingRight:    8,
                        overflow:        'hidden',
                        cursor:          'pointer',
                        zIndex:          5,
                        boxShadow:       '0 1px 3px rgba(0,0,0,0.15)',
                      }}
                      title={`${task.title} — ${task.priority}`}
                    >
                      <span style={{
                        color:        color.text,
                        fontSize:     11,
                        fontWeight:   600,
                        whiteSpace:   'nowrap',
                        overflow:     'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {task.title}
                      </span>
                    </div>
                  )}

                  {/* ── Dot (no start date) ── */}
                  {hasDot && (
                    <div
                      style={{
                        position:  'absolute',
                        left:      dotLeft,
                        top:       '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex:    5,
                      }}
                      title={`${task.title} — due date only`}
                    >
                      <div style={{
                        width:           14,
                        height:          14,
                        borderRadius:    '50%',
                        border:          `2px solid ${color.bg}`,
                        backgroundColor: 'white',
                        display:         'flex',
                        alignItems:      'center',
                        justifyContent:  'center',
                        cursor:          'pointer',
                        boxShadow:       '0 1px 3px rgba(0,0,0,0.15)',
                      }}>
                        <div style={{
                          width:           6,
                          height:          6,
                          borderRadius:    '50%',
                          backgroundColor: color.bg,
                        }}/>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-400 shrink-0 flex items-center justify-between">
        <span>{filteredTasks.length} tasks</span>
        <span>← scroll horizontally to see full month →</span>
      </div>
    </div>
  )
}
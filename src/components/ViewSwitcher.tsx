import { useTaskStore } from '../store/useTaskStore'

const VIEWS = [
  { id: 'kanban',   label: '⬛ Kanban'   },
  { id: 'list',     label: '☰ List'      },
  { id: 'timeline', label: '📅 Timeline' },
] as const

export default function ViewSwitcher() {
  const activeView    = useTaskStore((state) => state.activeView)
  const setActiveView = useTaskStore((state) => state.setActiveView)

  return (
    <div className="flex items-center justify-center gap-1 px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {VIEWS.map((view) => (
          <button
            key={view.id}
            onClick={() => setActiveView(view.id)}
            className={`
              px-5 py-2 rounded-lg text-sm font-semibold
              transition-all duration-200
              ${activeView === view.id
                ? 'bg-white text-indigo-600 shadow-sm border border-gray-200'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  )
}
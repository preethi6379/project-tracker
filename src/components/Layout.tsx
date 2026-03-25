import ViewSwitcher from './ViewSwitcher'
import FilterBar from './FilterBar'
import PresenceBar from './PresenceBar'

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">


      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">PT</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            Project Tracker
          </h1>
        </div>


        <PresenceBar />
      </div>

      <div className="shrink-0"><ViewSwitcher /></div>
      <div className="shrink-0"><FilterBar /></div>

      <main className="flex-1 overflow-hidden p-4">
        {children}
      </main>

    </div>
  )
}
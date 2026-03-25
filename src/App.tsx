import Layout from './components/Layout'
import KanbanView from './views/KanbanView'
import ListView from './views/ListView'
import TimelineView from './views/TimelineView'
import { useTaskStore } from './store/useTaskStore'

export default function App() {
  const activeView = useTaskStore((state) => state.activeView)

  return (
    <Layout>
      {activeView === 'kanban'   && <KanbanView />}
      {activeView === 'list'     && <ListView />}
      {activeView === 'timeline' && <TimelineView />}
    </Layout>
  )
}
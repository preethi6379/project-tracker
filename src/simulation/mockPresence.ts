import { USERS } from '../utils/seedData'
export type ActiveUser = {
  userId:   string
  taskId:   string
  color:    string
  initials: string
  name:     string
}

type PresenceCallback = (users: ActiveUser[]) => void

class PresenceSimulator {
  private activeUsers: ActiveUser[] = []
  private callbacks:   PresenceCallback[] = []
  private interval:    ReturnType<typeof setInterval> | null = null
  private taskIds:     string[] = []
  start(taskIds: string[]) {
    this.taskIds = taskIds
    const shuffled = [...USERS].sort(() => Math.random() - 0.5)
    const picked   = shuffled.slice(0, 3)
    this.activeUsers = picked.map((user) => ({
      userId:   user.id,
      taskId:   this.randomTaskId(),
      color:    user.color,
      initials: user.initials,
      name:     user.name,
    }))

    this.notify()
    this.interval = setInterval(() => {
      if (this.activeUsers.length === 0) return
      const index = Math.floor(Math.random() * this.activeUsers.length)
      this.activeUsers = this.activeUsers.map((u, i) =>
        i === index
          ? { ...u, taskId: this.randomTaskId() }
          : u
      )

      this.notify()
    }, 3000)
  }
  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.activeUsers = []
    this.notify()
  }
  subscribe(cb: PresenceCallback) {
    this.callbacks.push(cb)
    cb(this.activeUsers)
    return () => {
      this.callbacks = this.callbacks.filter((c) => c !== cb)
    }
  }
  private notify() {
    this.callbacks.forEach((cb) => cb([...this.activeUsers]))
  }
  private randomTaskId(): string {
    return this.taskIds[
      Math.floor(Math.random() * this.taskIds.length)
    ]
  }
}
export const presenceSimulator = new PresenceSimulator()
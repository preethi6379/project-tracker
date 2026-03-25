import { USERS } from '../utils/seedData'

// One active user watching a task
export type ActiveUser = {
  userId:   string
  taskId:   string
  color:    string
  initials: string
  name:     string
}

// Callback type — called when presence updates
type PresenceCallback = (users: ActiveUser[]) => void

class PresenceSimulator {
  private activeUsers: ActiveUser[] = []
  private callbacks:   PresenceCallback[] = []
  private interval:    ReturnType<typeof setInterval> | null = null
  private taskIds:     string[] = []

  // Start simulation with list of task ids
  start(taskIds: string[]) {
    this.taskIds = taskIds

    // Pick 3 random users from our 6
    const shuffled = [...USERS].sort(() => Math.random() - 0.5)
    const picked   = shuffled.slice(0, 3)

    // Assign each user a random task
    this.activeUsers = picked.map((user) => ({
      userId:   user.id,
      taskId:   this.randomTaskId(),
      color:    user.color,
      initials: user.initials,
      name:     user.name,
    }))

    this.notify()

    // Every 3 seconds — move a random user to a new task
    this.interval = setInterval(() => {
      if (this.activeUsers.length === 0) return

      // Pick a random user to move
      const index = Math.floor(Math.random() * this.activeUsers.length)

      // Move them to a different task
      this.activeUsers = this.activeUsers.map((u, i) =>
        i === index
          ? { ...u, taskId: this.randomTaskId() }
          : u
      )

      this.notify()
    }, 3000)
  }

  // Stop simulation — cleanup
  stop() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    this.activeUsers = []
    this.notify()
  }

  // Subscribe to presence updates
  subscribe(cb: PresenceCallback) {
    this.callbacks.push(cb)
    // Immediately call with current state
    cb(this.activeUsers)
    return () => {
      this.callbacks = this.callbacks.filter((c) => c !== cb)
    }
  }

  // Notify all subscribers
  private notify() {
    this.callbacks.forEach((cb) => cb([...this.activeUsers]))
  }

  // Pick a random task id
  private randomTaskId(): string {
    return this.taskIds[
      Math.floor(Math.random() * this.taskIds.length)
    ]
  }
}

// Single instance shared across the app
export const presenceSimulator = new PresenceSimulator()
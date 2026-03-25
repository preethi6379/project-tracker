
export type User = {
  id: string      
  name: string      
  initials: string  
  color: string     
}


export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done'
export type Task = {
  id: string          
  title: string        
  assignee: User       
  priority: Priority   
  status: Status       
  startDate: string    
  dueDate: string      
}

export type Filters = {
  status: Status[]      
  priority: Priority[]   
  assignees: string[]    
  dateFrom: string       
  dateTo: string         
}
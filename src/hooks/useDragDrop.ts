import { useRef, useState, useCallback } from 'react'
import type { Status } from '../types/task.types'
import { useTaskStore } from '../store/useTaskStore'

type DragState = {
  taskId: string
  sourceStatus: Status
}

export function useDragDrop() {
  const updateTaskStatus = useTaskStore(
    (state) => state.updateTaskStatus
  )
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [overStatus, setOverStatus] = useState<Status | null>(null)
  const ghostRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const handleDragStart = useCallback((
    e: React.PointerEvent,
    taskId: string,
    sourceStatus: Status
  ) => {
    e.preventDefault()

    setDragState({ taskId, sourceStatus })
    isDraggingRef.current = true
    if (ghostRef.current) {
      ghostRef.current.style.left    = `${e.clientX - 20}px`
      ghostRef.current.style.top     = `${e.clientY - 20}px`
      ghostRef.current.style.display = 'block'
    }

    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])
  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX - 20}px`
      ghostRef.current.style.top  = `${e.clientY - 20}px`
    }
    const el     = document.elementFromPoint(e.clientX, e.clientY)
    const column = el?.closest('[data-status]')
    const status = column?.getAttribute('data-status') as Status | null
    setOverStatus((prev) => prev !== status ? status : prev)

  }, [])
  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    if (ghostRef.current) {
      ghostRef.current.style.display = 'none'
    }
    const el         = document.elementFromPoint(e.clientX, e.clientY)
    const column     = el?.closest('[data-status]')
    const dropStatus = column?.getAttribute('data-status') as Status | null

    if (dropStatus && dragState) {
      updateTaskStatus(dragState.taskId, dropStatus)
    }
    isDraggingRef.current = false
    setDragState(null)
    setOverStatus(null)

  }, [dragState, updateTaskStatus])

  return {
    dragState,
    overStatus,
    ghostRef,      
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
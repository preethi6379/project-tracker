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

  // Only store WHAT is being dragged in state
  // NOT the position — position goes in ref
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [overStatus, setOverStatus] = useState<Status | null>(null)

  // Ref to the ghost card DOM element
  // We move it directly without re-renders
  const ghostRef = useRef<HTMLDivElement>(null)

  // Track if we are currently dragging
  const isDraggingRef = useRef(false)

  // ── Start drag ──────────────────────────────────────
  const handleDragStart = useCallback((
    e: React.PointerEvent,
    taskId: string,
    sourceStatus: Status
  ) => {
    e.preventDefault()

    setDragState({ taskId, sourceStatus })
    isDraggingRef.current = true

    // Move ghost to starting position immediately
    if (ghostRef.current) {
      ghostRef.current.style.left    = `${e.clientX - 20}px`
      ghostRef.current.style.top     = `${e.clientY - 20}px`
      ghostRef.current.style.display = 'block'
    }

    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  // ── Move drag ───────────────────────────────────────
  const handleDragMove = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    // Move ghost card directly — NO re-render!
    // This is why it's smooth
    if (ghostRef.current) {
      ghostRef.current.style.left = `${e.clientX - 20}px`
      ghostRef.current.style.top  = `${e.clientY - 20}px`
    }

    // Check which column cursor is over
    const el     = document.elementFromPoint(e.clientX, e.clientY)
    const column = el?.closest('[data-status]')
    const status = column?.getAttribute('data-status') as Status | null

    // Only update state if column changed
    // This reduces re-renders a lot
    setOverStatus((prev) => prev !== status ? status : prev)

  }, [])

  // ── End drag ────────────────────────────────────────
  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    if (!isDraggingRef.current) return

    // Hide ghost card
    if (ghostRef.current) {
      ghostRef.current.style.display = 'none'
    }

    // Check drop target
    const el         = document.elementFromPoint(e.clientX, e.clientY)
    const column     = el?.closest('[data-status]')
    const dropStatus = column?.getAttribute('data-status') as Status | null

    if (dropStatus && dragState) {
      updateTaskStatus(dragState.taskId, dropStatus)
    }

    // Reset everything
    isDraggingRef.current = false
    setDragState(null)
    setOverStatus(null)

  }, [dragState, updateTaskStatus])

  return {
    dragState,
    overStatus,
    ghostRef,       // ← we pass this to ghost card
    handleDragStart,
    handleDragMove,
    handleDragEnd,
  }
}
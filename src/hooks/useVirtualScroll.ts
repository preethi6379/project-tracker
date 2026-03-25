import { useState, useRef, useCallback, useEffect } from 'react'

type Options = {
  totalItems:   number
  itemHeight:   number
  bufferSize?:  number
}

type VirtualScrollResult = {
  containerRef:      React.RefObject<HTMLDivElement | null>
  totalHeight:       number
  startIndex:        number
  endIndex:          number
  offsetY:           number
}

export function useVirtualScroll({
  totalItems,
  itemHeight,
  bufferSize = 5,
}: Options): VirtualScrollResult {
  const [scrollTop, setScrollTop] = useState(0)
  const [visibleHeight, setVisibleHeight] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    setVisibleHeight(container.clientHeight)
    container.addEventListener('scroll', handleScroll, { passive: true })
    const resizeObserver = new ResizeObserver(() => {
      setVisibleHeight(container.clientHeight)
    })
    resizeObserver.observe(container)
     return () => {
      container.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [handleScroll])
  const totalHeight = totalItems * itemHeight
  const firstVisibleIndex = Math.floor(scrollTop / itemHeight)
  const visibleCount = Math.ceil(visibleHeight / itemHeight)
  const startIndex = Math.max(0, firstVisibleIndex - bufferSize)
  const endIndex = Math.min(
    totalItems - 1,
    firstVisibleIndex + visibleCount + bufferSize
  )
  const offsetY = startIndex * itemHeight

  return {
    containerRef,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
  }
}
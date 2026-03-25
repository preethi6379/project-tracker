import { useState, useRef, useCallback, useEffect } from 'react'

type Options = {
  // Total number of items in the list
  totalItems:   number
  // Height of each row in pixels — must be fixed
  itemHeight:   number
  // How many extra rows to render above and below
  // visible area — prevents blank flash on fast scroll
  bufferSize?:  number
}

type VirtualScrollResult = {
  // Ref to attach to the scrollable container div
  containerRef:      React.RefObject<HTMLDivElement | null>
  // Total height of the list — makes scrollbar correct
  totalHeight:       number
  // Index of first item to render
  startIndex:        number
  // Index of last item to render
  endIndex:          number
  // How far to push rendered items down
  // so they appear at correct position
  offsetY:           number
}

export function useVirtualScroll({
  totalItems,
  itemHeight,
  bufferSize = 5,
}: Options): VirtualScrollResult {

  // scrollTop = how many pixels user has scrolled down
  const [scrollTop, setScrollTop] = useState(0)

  // visibleHeight = how tall the container is on screen
  const [visibleHeight, setVisibleHeight] = useState(600)

  // Ref to the scrollable div
  const containerRef = useRef<HTMLDivElement>(null)

  // Called every time user scrolls
  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop)
    }
  }, [])

  // Watch container size changes
  // e.g. when window is resized
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Set initial height
    setVisibleHeight(container.clientHeight)

    // Listen for scroll events
    container.addEventListener('scroll', handleScroll, { passive: true })

    // ResizeObserver watches if container size changes
    const resizeObserver = new ResizeObserver(() => {
      setVisibleHeight(container.clientHeight)
    })
    resizeObserver.observe(container)

    // Cleanup when component unmounts
    return () => {
      container.removeEventListener('scroll', handleScroll)
      resizeObserver.disconnect()
    }
  }, [handleScroll])

  // ── Calculate which items to show ──────────────────

  // Total scrollable height
  // e.g. 500 tasks × 56px = 28000px
  const totalHeight = totalItems * itemHeight

  // Which item is at the very top of visible area?
  // e.g. scrolled 560px ÷ 56px = item 10 is at top
  const firstVisibleIndex = Math.floor(scrollTop / itemHeight)

  // How many items fit in the visible area?
  // e.g. 600px container ÷ 56px = 10 items visible
  const visibleCount = Math.ceil(visibleHeight / itemHeight)

  // Start a few items early (buffer)
  // so fast scrolling doesn't show blank gaps
  const startIndex = Math.max(0, firstVisibleIndex - bufferSize)

  // End a few items late (buffer)
  const endIndex = Math.min(
    totalItems - 1,
    firstVisibleIndex + visibleCount + bufferSize
  )

  // How far to push items down so they appear
  // at the correct position in the list
  // e.g. startIndex=10, itemHeight=56
  // offsetY = 10 × 56 = 560px from top
  const offsetY = startIndex * itemHeight

  return {
    containerRef,
    totalHeight,
    startIndex,
    endIndex,
    offsetY,
  }
}
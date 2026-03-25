import { forwardRef } from 'react'
import type { Task } from '../types/task.types'

type Props = {
  task: Task | null
}

const DragGhost = forwardRef<HTMLDivElement, Props>(
  ({ task }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          position:      'fixed',
          display:       'none',
          pointerEvents: 'none',
          zIndex:        9999,
          willChange:    'left, top',
        }}
      >
        {task && (
          <>
            {/* ── Small cursor dot ── */}
            <div
              style={{
                position:        'absolute',
                top:             '-4px',
                left:            '-4px',
                width:           '12px',
                height:          '12px',
                borderRadius:    '50%',
                backgroundColor: task.assignee.color,
                border:          '2px solid white',
                boxShadow:       '0 2px 6px rgba(0,0,0,0.2)',
              }}
            />

            {/* ── Task name pill ── */}
            <div
              style={{
                position:        'absolute',
                top:             '-28px',
                left:            '12px',
                backgroundColor: task.assignee.color,
                color:           'white',
                fontSize:        '11px',
                fontWeight:      600,
                padding:         '3px 10px',
                borderRadius:    '999px',
                whiteSpace:      'nowrap',
                boxShadow:       '0 2px 8px rgba(0,0,0,0.15)',
                maxWidth:        '180px',
                overflow:        'hidden',
                textOverflow:    'ellipsis',
              }}
            >
              {task.title}
            </div>
          </>
        )}
      </div>
    )
  }
)

export default DragGhost


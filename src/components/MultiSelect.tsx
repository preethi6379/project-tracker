import { useState, useRef, useEffect } from 'react'

type Option = {
  value: string
  label: string
  color?: string  
}

type Props = {
  label:     string        
  options:   Option[]      
  selected:  string[]      
  onChange:  (values: string[]) => void
}

export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: Props) {
 
  
  const [isOpen, setIsOpen] = useState(false)
  const containerRef        = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current &&
          !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  function toggleOption(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else {
      onChange([...selected, value])
    }
  }

  const hasSelection = selected.length > 0

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-sm
          border transition-all duration-150
          ${hasSelection
            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-medium'
            : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
          }
        `}
      >
        {label}

       
       
        {hasSelection && (
          <span className="bg-indigo-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            {selected.length}
          </span>
        )}


        <span className={`text-xs transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}>
          ˅
        </span>
      </button>

      
      
      {isOpen && (
        <div className="
          absolute top-full left-0 mt-1 z-50
          bg-white rounded-xl shadow-lg border border-gray-200
          min-w-[160px] py-1 overflow-hidden
        ">
          {options.map((option) => {
            const isSelected = selected.includes(option.value)

            return (
              <button
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`
                  w-full flex items-center gap-2 px-3 py-2
                  text-sm text-left transition-colors
                  ${isSelected
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                
                
                <div className={`
                  w-4 h-4 rounded border-2 flex items-center
                  justify-center shrink-0 transition-colors
                  ${isSelected
                    ? 'bg-indigo-500 border-indigo-500'
                    : 'border-gray-300'
                  }
                `}>
                  {isSelected && (
                    <span className="text-white text-[10px] font-bold">✓</span>
                  )}
                </div>

              
              
                {option.color && (
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: option.color }}
                  />
                )}

                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
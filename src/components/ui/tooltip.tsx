"use client"

import * as React from "react"

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode
}

export function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className="absolute z-50 w-64 p-3 text-sm rounded-lg shadow-lg bg-[rgba(15,23,42,0.98)] border border-[rgba(148,163,255,0.3)] text-[#f5f7ff]"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px'
          }}
        >
          {content}
        </div>
      )}
    </span>
  )
}

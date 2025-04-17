'use client'

import { useState, useEffect } from 'react'

export default function TailwindBreakpointViewer() {
  const [isVisible, setIsVisible] = useState(true)
  const [windowWidth, setWindowWidth] = useState(0)

  useEffect(() => {
    // Set initial width
    setWindowWidth(window.innerWidth)

    // Handle resize events
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
      setIsVisible(true)
    }

    window.addEventListener('resize', handleResize)

    // Auto-hide after 3 seconds
    const hideTimeout = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(hideTimeout)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div 
      className={`fixed top-0 ease-out duration-300 flex items-center w-auto px-2 py-1 text-xs text-gray-200 border rounded-full border-neutral-200/50 dark:border-neutral-700/70 shadow-lg backdrop-blur-lg bg-white/80 dark:bg-neutral-900 left-1/2 -translate-x-1/2 ${isVisible ? 'mt-3' : '-translate-y-full'}`}
      style={{ zIndex: 9999 }}
    >
      <div className="px-1.5 py-px font-bold bg-blue-500 rounded-full">
        <span className="inline-block sm:hidden">XS</span>
        <span className="hidden sm:inline-block md:hidden">SM</span>
        <span className="hidden md:inline-block lg:hidden">MD</span>
        <span className="hidden lg:inline-block xl:hidden">LG</span>
        <span className="hidden xl:inline-block">XL</span>
      </div>
      <span className="px-2 py-1 text-black dark:text-white">
        {windowWidth}px
      </span>
      <button
        onClick={handleClose}
        className="flex items-center justify-center w-5 h-5 text-gray-500 rounded-full cursor-pointer dark:text-neutral-300 bg-neutral-200/60 dark:bg-neutral-700/80 dark:hover:bg-neutral-700 hover:bg-neutral-200"
      >
        <svg 
          className="w-3 h-3" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
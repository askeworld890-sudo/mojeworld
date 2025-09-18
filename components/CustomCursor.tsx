'use client'

import { useEffect } from 'react'

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor') as HTMLElement
    const cursorFollower = document.querySelector('.cursor-follower') as HTMLElement

    if (!cursor || !cursorFollower) return

    const handleMouseMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'

      setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px'
        cursorFollower.style.top = e.clientY + 'px'
      }, 80)
    }

    const handleMouseEnter = () => {
      cursor.style.opacity = '1'
      cursorFollower.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      cursor.style.opacity = '0'
      cursorFollower.style.opacity = '0'
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button')

    const handleElementMouseEnter = (e: Event) => {
      const element = e.target as HTMLElement
      cursor.style.width = '20px'
      cursor.style.height = '20px'
      cursor.style.backgroundColor = 'transparent'
      cursor.style.border = `2px solid ${getComputedStyle(element).color}`
    }

    const handleElementMouseLeave = () => {
      cursor.style.width = '8px'
      cursor.style.height = '8px'
      cursor.style.backgroundColor = '#0ef'
      cursor.style.border = 'none'
    }

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleElementMouseEnter)
      el.addEventListener('mouseleave', handleElementMouseLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)

      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleElementMouseEnter)
        el.removeEventListener('mouseleave', handleElementMouseLeave)
      })
    }
  }, [])

  return (
    <>
      <div className="cursor"></div>
      <div className="cursor-follower"></div>
    </>
  )
}
'use client'

import { useEffect, useState } from 'react'

export default function Preloader() {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`preloader ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loader"></div>
    </div>
  )
}
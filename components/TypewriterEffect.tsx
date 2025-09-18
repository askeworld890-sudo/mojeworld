'use client'

import { useEffect, useState } from 'react'

export default function TypewriterEffect() {
  const [displayText, setDisplayText] = useState("Art that Flows, <span>Stories that Speak.</span> Through the Oil Paintings")

  const dynamicWords = [
    "Oil Paintings",
    "Pencil Sketches",
    "Watercolor Art",
    "Arabic calligraphy",
    "Timeless Portraits",
    "Vibrant landscapes",
    "Custom Commissions"
  ]

  useEffect(() => {
    let wordIndex = 0
    let charIndex = 0
    let isDeleting = false
    let typeSpeed = 200

    const typeWriterEffect = () => {
      const currentWord = dynamicWords[wordIndex]
      const baseText = "Art that Flows, <span>Stories that Speak.</span> Through the "

      if (!isDeleting && charIndex < currentWord.length) {
        // Typing
        setDisplayText(baseText + `<span class="typewriter">${currentWord.substring(0, charIndex + 1)}</span>`)
        charIndex++
        typeSpeed = 100
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        setDisplayText(baseText + `<span class="typewriter">${currentWord.substring(0, charIndex - 1)}</span>`)
        charIndex--
        typeSpeed = 50
      } else {
        // Switch words
        isDeleting = !isDeleting
        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % dynamicWords.length
        }
        typeSpeed = isDeleting ? 1500 : 500
      }
    }

    const interval = setInterval(typeWriterEffect, typeSpeed)

    return () => clearInterval(interval)
  }, [])

  return (
    <h1 dangerouslySetInnerHTML={{ __html: displayText }} />
  )
}
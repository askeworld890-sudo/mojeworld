'use client'

import { useEffect, useRef } from 'react'

// Declare global types for Three.js
declare global {
  interface Window {
    THREE: any
  }
}

export default function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let scene: any, camera: any, renderer: any, torus: any, animationId: any

    const init = async () => {
      // Wait for Three.js to load
      while (!window.THREE) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      const hero = document.querySelector('.hero') as HTMLElement
      const bgCanvas = document.getElementById('bg') as HTMLCanvasElement

      if (!bgCanvas || !hero) return

      renderer = new window.THREE.WebGLRenderer({
        canvas: bgCanvas,
        alpha: true,
        antialias: true
      })

      scene = new window.THREE.Scene()
      camera = new window.THREE.PerspectiveCamera(60, 1, 0.1, 1000)
      camera.position.set(0, 0, 30)

      const rootStyles = getComputedStyle(document.documentElement)
      const primaryColor = rootStyles.getPropertyValue('--primary').trim()

      // Torus
      const geometry = new window.THREE.TorusGeometry(10, 3, 16, 100)
      const material = new window.THREE.MeshStandardMaterial({
        color: new window.THREE.Color(primaryColor),
        transparent: true,
        opacity: 0.7,
        wireframe: true
      })
      torus = new window.THREE.Mesh(geometry, material)
      scene.add(torus)
      torus.position.x = 6
      torus.scale.set(0.7, 0.7, 0.7)

      // Lights
      const pointLight = new window.THREE.PointLight(0x00ffff, 0.7)
      pointLight.position.set(20, 20, 20)
      const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.25)
      scene.add(pointLight, ambientLight)


      // Size renderer to hero
      function sizeToHero() {
        const rect = hero.getBoundingClientRect()
        renderer.setSize(rect.width, rect.height, false)
        camera.aspect = (rect.width / rect.height) || 1
        camera.updateProjectionMatrix()
      }

      sizeToHero()
      window.addEventListener('resize', sizeToHero)

      // Animate
      function animate() {
        animationId = requestAnimationFrame(animate)
        if (torus) {
          torus.rotation.x += 0.01
          torus.rotation.y += 0.005
          torus.rotation.z += 0.01
        }
        renderer.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('resize', sizeToHero)
      }
    }

    init()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (renderer) {
        renderer.dispose()
      }
    }
  }, [])

  return <div ref={mountRef} style={{ display: 'none' }} />
}
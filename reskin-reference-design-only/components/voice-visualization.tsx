"use client"

import { useEffect, useRef } from 'react'

interface VoiceVisualizationProps {
  isActive: boolean
  type: 'user' | 'assistant'
}

export function VoiceVisualization({ isActive, type }: VoiceVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !isActive) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    const bars = 20
    const barWidth = 2
    const gap = 2
    const maxHeight = 20

    const animate = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < bars; i++) {
        const height = isActive ? Math.random() * maxHeight : 2
        const x = i * (barWidth + gap)
        const y = (canvas.height - height) / 2

        ctx.fillStyle = type === 'user' ? '#7C3AED' : '#64748B'
        ctx.fillRect(x, y, barWidth, height)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive, type])

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={24}
      className="opacity-80"
    />
  )
}


'use client'

import { ReactNode, useEffect, useRef, useState } from 'react'

interface AnimationProps {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
}

/**
 * FadeIn component - Fades in content with optional delay
 */
export function FadeIn({ 
  children, 
  delay = 0, 
  duration = 600,
  className = '' 
}: AnimationProps) {
  return (
    <div 
      className={`animate-fade-in ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

/**
 * SlideUp component - Slides up and fades in content
 */
export function SlideUp({ 
  children, 
  delay = 0, 
  duration = 500,
  className = '' 
}: AnimationProps) {
  return (
    <div 
      className={`animate-slide-up ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

/**
 * ScaleIn component - Scales in content with zoom effect
 */
export function ScaleIn({ 
  children, 
  delay = 0, 
  duration = 400,
  className = '' 
}: AnimationProps) {
  return (
    <div 
      className={`animate-scale-in ${className}`}
      style={{ 
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

/**
 * ScrollReveal component - Reveals content when scrolled into view
 * Uses Intersection Observer for performance
 * @param triggerOnce - If true, animation plays only once. If false, replays on each scroll into view.
 */
export function ScrollReveal({ 
  children, 
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = '' 
}: AnimationProps & { threshold?: number; triggerOnce?: boolean }) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = elementRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Only unobserve if triggerOnce is true
          if (triggerOnce && node) {
            observer.unobserve(node)
          }
        } else if (!triggerOnce) {
          // If triggerOnce is false, reset when scrolled out of view
          setIsVisible(false)
        }
      },
      { threshold }
    )

    if (node) {
      observer.observe(node)
    }

    return () => {
      if (node) {
        observer.unobserve(node)
      }
    }
  }, [threshold, triggerOnce])

  return (
    <div 
      ref={elementRef}
      className={`transition-all duration-700 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ 
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

/**
 * StaggerContainer component - Animates children with staggered delays
 */
export function StaggerContainer({ 
  children, 
  staggerDelay = 100,
  className = '' 
}: AnimationProps & { staggerDelay?: number }) {
  const childrenArray = Array.isArray(children) ? children : [children]
  
  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <div 
          key={index}
          className="animate-fade-in-up"
          style={{ 
            animationDelay: `${index * staggerDelay}ms`,
            animationFillMode: 'both'
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

/**
 * HoverScale component - Adds smooth scale effect on hover
 */
export function HoverScale({ 
  children, 
  scale = 1.05,
  className = '' 
}: AnimationProps & { scale?: number }) {
  return (
    <div 
      className={`transition-transform duration-300 ease-out hover:scale-[${scale}] ${className}`}
    >
      {children}
    </div>
  )
}

/**
 * Float component - Adds floating animation effect
 */
export function Float({ 
  children, 
  className = '' 
}: AnimationProps) {
  return (
    <div className={`animate-float ${className}`}>
      {children}
    </div>
  )
}

/**
 * Shimmer component - Adds shimmer loading effect
 */
export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`} />
  )
}

/**
 * GlowPulse component - Adds pulsing glow effect
 */
export function GlowPulse({ 
  children, 
  className = '' 
}: AnimationProps) {
  return (
    <div className={`animate-pulse-glow ${className}`}>
      {children}
    </div>
  )
}

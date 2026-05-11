import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { ReactNode } from 'react'

interface AnimatedElementProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
}

const directionVariants = {
  up: { y: 30 },
  down: { y: -30 },
  left: { x: 30 },
  right: { x: -30 },
  none: {},
}

export function AnimatedElement({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.5,
  once = true,
}: AnimatedElementProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{
        opacity: 0,
        ...directionVariants[direction],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

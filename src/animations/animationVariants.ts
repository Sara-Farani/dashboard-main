// ------------------------------------------------------------------
// Framer Motion reusable variants for the whole dashboard
// ------------------------------------------------------------------

import type { Variants } from 'framer-motion'

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

// Slide in from the right (feels natural in RTL)
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
}

// Slide in from the left
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
}

// Slide up entrance, common for cards
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 220, damping: 28 },
  },
}

// Scale entrance for modals / popovers
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 26 },
  },
}

// Modal pop with backdrop fade
export const modalPop: Variants = {
  hidden: { opacity: 0, scale: 0.85, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 340, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.18, ease: 'easeIn' },
  },
}

export const backdropFade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
}

// Container that staggers its children
export const staggerContainer = (stagger = 0.08, delayChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
})

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 240, damping: 24 },
  },
}

// Page transition used by AnimatePresence around routes
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.2, ease: 'easeIn' } },
}

// Sidebar collapse / expand
export const sidebarVariants: Variants = {
  expanded: { width: 264, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  collapsed: { width: 76, transition: { type: 'spring', stiffness: 300, damping: 30 } },
}

// Shake — used on login failure
export const shakeVariants: Variants = {
  shake: {
    x: [0, -12, 12, -8, 8, -4, 4, 0],
    transition: { duration: 0.5 },
  },
}

// Pulsing dot for the "live" badge
export const pulseDot: Variants = {
  animate: {
    scale: [1, 1.5, 1],
    opacity: [1, 0.55, 1],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
  },
}
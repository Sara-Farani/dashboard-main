import { useEffect, useState } from 'react'

/**
 * useDebouncedValue — returns `value` after `delay` ms of no changes.
 * Used for the search input in tables.
 */
export default function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
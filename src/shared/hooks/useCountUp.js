import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

export function useCountUp(to, { from = 0, duration = 1.2, delay = 0 } = {}) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    const controls = animate(from, to, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [to, from, duration, delay])

  return value
}

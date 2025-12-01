import { useEffect, useState } from 'react'

function Loading() {
  const loadingMessage = 'GlIGHFE'
  const [count, setCount] = useState(0)

  useEffect(() => {
    const intervalId: number = window.setInterval(() => {
      setCount((prevCount) =>
        prevCount >= loadingMessage.length ? 0 : prevCount + 1,
      )
    }, 500)
    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  return <p data-testid="loading-indicator">{loadingMessage.slice(0, count)}</p>
}
export default Loading

import { useRef, useState, useCallback } from 'react'

export function useFrameAnimation(
  frameCount: number,
  fps: number,
  onComplete: () => void,
) {
  const [frame, setFrame] = useState(1)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const frameRef = useRef(1)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const play = useCallback(() => {
    stop()
    intervalRef.current = setInterval(() => {
      frameRef.current += 1
      if (frameRef.current > frameCount) {
        frameRef.current = frameCount
        setFrame(frameCount)
        stop()
        onCompleteRef.current()
        return
      }
      setFrame(frameRef.current)
    }, 1000 / fps)
  }, [frameCount, fps, stop])

  const pause = useCallback(() => stop(), [stop])

  const reset = useCallback(() => {
    stop()
    frameRef.current = 1
    setFrame(1)
  }, [stop])

  return { frame, play, pause, reset }
}

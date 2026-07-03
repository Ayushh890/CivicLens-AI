import { useState, useCallback } from 'react'

const DEFAULT = { latitude: 28.6139, longitude: 77.2090 }

export default function useGeolocation() {
  const [position, setPosition] = useState(DEFAULT)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }
    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setIsLoading(false)
      },
      (err) => {
        setError(err.message)
        setIsLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }, [])

  return { ...position, error, isLoading, requestLocation }
}

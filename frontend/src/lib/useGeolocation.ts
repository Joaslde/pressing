import { useState } from 'react'

interface GeolocationState {
  status: 'idle' | 'requesting' | 'success' | 'error' | 'unsupported'
  coords: { latitude: number; longitude: number } | null
  error: string | null
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: 'idle',
    coords: null,
    error: null,
  })

  const request = () => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unsupported', coords: null, error: "La géolocalisation n'est pas supportée par ce navigateur." })
      return
    }

    setState((s) => ({ ...s, status: 'requesting', error: null }))

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'success',
          coords: { latitude: position.coords.latitude, longitude: position.coords.longitude },
          error: null,
        })
      },
      (error) => {
        const message =
          error.code === error.PERMISSION_DENIED
            ? 'Vous avez refusé l\'accès à votre position. Vous pouvez saisir votre adresse manuellement.'
            : 'Impossible de récupérer votre position. Vous pouvez saisir votre adresse manuellement.'
        setState({ status: 'error', coords: null, error: message })
      },
      { enableHighAccuracy: true, timeout: 10_000 }
    )
  }

  return { ...state, request }
}

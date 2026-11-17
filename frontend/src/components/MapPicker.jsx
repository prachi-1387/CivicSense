
import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function MapUpdater({ position }) {
  const map = useMap()

  useEffect(() => {
    if (position) {
      map.setView(position, 16)
    }
  }, [position, map])

  return null
}

function LocationMarker({ onLocationSelect, gpsPosition }) {
  const [position, setPosition] = useState(null)

  useEffect(() => {
    if (gpsPosition) {
      setPosition({
        lat: gpsPosition[0],
        lng: gpsPosition[1],
      })
    }
  }, [gpsPosition])

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng

      setPosition(e.latlng)

      onLocationSelect({
        lat,
        lng,
        address: 'Fetching address...',
      })

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        )

        if (!response.ok) {
          throw new Error('Address lookup failed')
        }

        const data = await response.json()

        onLocationSelect({
          lat,
          lng,
          address: data.display_name || 'Address not found',
        })
      } catch (error) {
        console.error('Address lookup error:', error)

        onLocationSelect({
          lat,
          lng,
          address: 'Address could not be detected',
        })
      }
    },
  })

  return position === null ? null : (
    <Marker position={position} />
  )
}

function MapPicker({ onLocationSelect }) {
  const defaultPosition = [28.6139, 77.2090]

  const [currentPosition, setCurrentPosition] = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }

    setGpsLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        setCurrentPosition([latitude, longitude])
        setGpsLoading(false)

        onLocationSelect({
          lat: latitude,
          lng: longitude,
          address: 'Fetching address...',
        })

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )

          if (!response.ok) {
            throw new Error('Address lookup failed')
          }

          const data = await response.json()

          onLocationSelect({
            lat: latitude,
            lng: longitude,
            address: data.display_name || 'Address not found',
          })
        } catch (error) {
          console.error('Address lookup error:', error)

          onLocationSelect({
            lat: latitude,
            lng: longitude,
            address: 'Address could not be detected',
          })
        }
      },
      (error) => {
        setGpsLoading(false)
        alert('Unable to detect location. Please allow location access.')
        console.error(error)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-400">
        Click on the map to select the location of the civic issue.
      </p>

      <button
        type="button"
        onClick={handleCurrentLocation}
        disabled={gpsLoading}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {gpsLoading ? 'Detecting location...' : 'Use My Current Location'}
      </button>

      <MapContainer
        center={defaultPosition}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: '350px', width: '100%', borderRadius: '12px' }}
      >
        <MapUpdater position={currentPosition} />

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          onLocationSelect={onLocationSelect}
          gpsPosition={currentPosition}
        />
      </MapContainer>
    </div>
  )
}

export default MapPicker

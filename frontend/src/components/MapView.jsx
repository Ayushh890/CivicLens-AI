import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { getSeverityColor, ISSUE_TYPES } from '../utils/constants'
import SeverityBadge from './SeverityBadge'

function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

export default function MapView({ reports = [], center = [28.6139, 77.2090], zoom = 12, height = '500px', onMarkerClick }) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }}
      className="rounded-2xl z-0">
      <ChangeView center={center} zoom={zoom} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
      />
      {reports.map(r => (
        <CircleMarker key={r.id}
          center={[r.latitude, r.longitude]}
          radius={r.severityScore >= 76 ? 12 : r.severityScore >= 51 ? 9 : 7}
          fillColor={getSeverityColor(r.severityScore)}
          color="white"
          fillOpacity={0.8}
          weight={2}
          eventHandlers={{ click: () => onMarkerClick?.(r) }}>
          <Popup>
            <div className="min-w-[200px]">
              <p className="font-bold text-sm mb-1 text-surface-800">{ISSUE_TYPES[r.issueType]?.icon} {r.title}</p>
              <SeverityBadge score={r.severityScore} />
              <p className="text-xs text-surface-500 mt-1">{r.address}</p>
              <p className="text-xs text-surface-400 mt-1 font-mono">{r.id} | {r.status}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

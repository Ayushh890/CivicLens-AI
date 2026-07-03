import { Circle } from 'react-leaflet'
import { getSeverityColor } from '../utils/constants'

export default function HeatmapLayer({ reports = [] }) {
  return (
    <>
      {reports.map(r => (
        <Circle key={`heat-${r.id}`}
          center={[r.latitude, r.longitude]}
          radius={150}
          pathOptions={{
            color: 'transparent',
            fillColor: getSeverityColor(r.severityScore),
            fillOpacity: 0.12,
          }}
        />
      ))}
    </>
  )
}

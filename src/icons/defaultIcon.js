import L from 'leaflet'
import iconUrl from './../images/marker-icon.png'
import iconShadow from './../images/marker-shadow.png'

const { iconSize, shadowSize, iconAnchor, tooltipAnchor } = L.Marker.prototype.options.icon.options

export const defaultIcon = L.icon({
  iconSize,
  shadowSize,
  iconAnchor,
  tooltipAnchor,
  iconUrl,
  iconShadow
})
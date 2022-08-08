import mountPng from './../images/mountain.png'
import L from 'leaflet'

const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [35,23],
    iconAnchor: [17, 16],
    tooltipAnchor: [-15, -5]
  }
})

export const mountIcon = new LeafIcon({ iconUrl: mountPng })
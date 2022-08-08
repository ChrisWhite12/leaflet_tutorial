import {Marker, Tooltip, useMap, LayersControl, LayerGroup} from 'react-leaflet';
import {mountIcon} from '../icons/mount-icon';

export const MarkerLayerWithToolTip = ({data}) => {
  const map = useMap()

  return (
    <LayersControl.Overlay
      checked
      name="mountains"
    >
      <LayerGroup>

        {data.features.map((feature, i) => {
          const {coordinates} = feature.geometry;
          const {name, elevation, continent} = feature.properties;
          return <Marker
            key={i}
            position={[coordinates[1], coordinates[0]]}
            icon={mountIcon}
            eventHandlers={{
              click: (e) => {
                map.panTo(e.latlng)
              }
            }}
          >
            <Tooltip>
              <h3>Mt. {name}</h3>
              <p>Continent: {continent}</p>
              <p>Elevation: {elevation}</p>
            </Tooltip>
          </Marker>
        })}
      </LayerGroup>
    </LayersControl.Overlay>
  )
}
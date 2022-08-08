import React from 'react'
import {Circle, LayersControl} from 'react-leaflet';

const RadiusFilter = ({radiusFilter, setRadiusFilter}) => {
  if (!radiusFilter) return <></>
  const {coordinates} = radiusFilter.feature.geometry;

  return (
    <LayersControl.Overlay
      checked
      name='radiusFilter'
    >
      <Circle
        center={[coordinates[1], coordinates[0]]}
        color={'purple'}
        weight={1}
        fillOpacity={0.4}
        radius={radiusFilter.radius * 1000}
        eventHandlers={{
          dblclick: (e) => {
            e.originalEvent.view.L.DomEvent.stopPropagation(e);
            setRadiusFilter(null);
          }
        }}
      />
    </LayersControl.Overlay>
  );
};

export default RadiusFilter
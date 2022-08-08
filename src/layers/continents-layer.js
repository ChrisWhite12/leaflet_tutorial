import React from 'react'
import {GeoJSON, LayersControl} from 'react-leaflet';

const ContinentsLayer = ({setGeoFilter, data, geoFilter}) => {

  return (
    <LayersControl.Overlay
      checked
      name="Continents"
    >
      <GeoJSON
        key='geo-layer'
        data={data}
        eventHandlers={{
          click: (e) => {
            setGeoFilter((prev) => {
              const same = prev === e.propagatedFrom.feature
              return same ? null : e.propagatedFrom.feature
            })
          }
        }}
        style={(feature) => {
          return {
            color: geoFilter === feature ? 'red' : 'blue',
            weight: 0.5,
            fillOpacity: 0.4
          }
        }}
      />
    </LayersControl.Overlay>
  );
};

export default ContinentsLayer
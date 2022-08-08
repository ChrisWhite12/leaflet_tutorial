import {useState, useEffect} from 'react'
import {MapContainer, TileLayer, LayersControl} from 'react-leaflet';
import {MarkerLayer} from './../layers/marker-layer'

import {cities} from './../data/cities'
import {mountains} from '../data/mountains';
import {continents} from './../data/continents'
import {MarkerLayerWithToolTip} from '../layers/marker-with-tooltip';
import RadiusFilter from '../layers/radius-filter';
import ContinentsLayer from '../layers/continents-layer';

// import Spiderfy from '../layers/Spiderfy';

const Map = (props) => {
  const [radiusFilter, setRadiusFilter] = useState(null);
  const [geoFilter, setGeoFilter] = useState(null);

  useEffect(() => {
    console.log('radiusFilter', radiusFilter);
  }, [radiusFilter]);

  return (
    <MapContainer center={[0, 0]} zoom={2} maxZoom={5}>
      <LayersControl
        position="topright"
      >
        <LayersControl.BaseLayer
          checked
          name="streets"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        {/* <Spiderfy> */}
          <MarkerLayer
            data={cities}
            setRadiusFilter={setRadiusFilter}
            radiusFilter={radiusFilter}
            geoFilter={geoFilter}
          />
        {/* </Spiderfy> */}
        <MarkerLayerWithToolTip
          data={mountains}
        />
        <RadiusFilter
          radiusFilter={radiusFilter}
          setRadiusFilter={setRadiusFilter}
        />
        <ContinentsLayer
          geoFilter={geoFilter}
          setGeoFilter={setGeoFilter}
          data={continents}
        />
      </LayersControl>
      {/* <FitBoundsToDataControl /> */}
    </MapContainer>
  );
};

export default Map
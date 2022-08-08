import React from 'react'
import Map from './map/map';
import "leaflet/dist/leaflet.css"
import "./app.css"

const App = (props) => {

  return (
    <div>
      <Map />
    </div>
  );
};

export default App
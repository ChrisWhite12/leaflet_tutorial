import {FilterAlt} from '@mui/icons-material';
import { Button, Card, CardContent, Input, Stack, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {Marker, Popup, LayersControl, LayerGroup, useMap } from 'react-leaflet';
import {defaultIcon} from '../icons/defaultIcon';
import L from 'leaflet'
// import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import useSupercluster from "use-supercluster";

const PopupStats = ({feature, setRadiusFilter }) => {
  const {name, adm0name, pop_max} = feature.properties
  const [radius, setRadius] = useState(3000);
  return (
    <>
      <Card sx={{width: '300px'}}>
        <CardContent>
          <Typography variant='h3'>Name</Typography>
          <b>{`${name}, ${adm0name}`}</b>
          <Typography>Population</Typography>
          <b>{pop_max}</b>
          <Typography>Radius Filter</Typography>
          <Stack direction={'row'} spacing={2}>
            <Input
              type='number'
              defaultValue={3000}
              onChange={(e) => {
                setRadius(e.target.value)
              }}
            ></Input>
            <Button
              variant="contained"
              startIcon={<FilterAlt />}
              onClick={() => setRadiusFilter((prev) => {
                let newFilter;
                if (prev) {
                  if(radius === 0){
                    newFilter = prev
                  } else {
                    const sameFeature = prev.feature === feature
                    const sameRadius = prev.radius === radius
                    if(!sameFeature || !sameRadius){
                      newFilter = { feature, radius }
                    }
                  }
                }
                else if (radius !== 0 ){
                  newFilter = { feature, radius }
                }
                return newFilter
              })}
              >Filter</Button>
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}

export const MarkerLayer = ({data, setRadiusFilter, radiusFilter, geoFilter}) => {
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(5);

  const icons = {};
  const fetchIcon = (count, size) => {
    if (!icons[count]) {
      icons[count] = L.divIcon({
        html: `<div class="cluster-marker" style="width: ${size}px; height: ${size}px;">
          ${count}
        </div>`
      });
    }
    return icons[count];
  };

  const map = useMap();

  const updateMap = () => {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat
    ]);
    setZoom(map.getZoom());
  }

  const { clusters, supercluster } = useSupercluster({
    points: data.features,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  const generatePointsCircle = (count, centerPt) => {
    const circumference = 2 * 25 * (2 + count)
    const legLength = circumference / (Math.PI * 2)  //radius from circumference
    const angleStep = (Math.PI * 2) / count
    const res = []
  
    res.length = count;

    for (let i = 0; i < count; i++) { // Clockwise, like spiral.
      const angle = 0 + i * angleStep;
      res[i] = new L.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle))._round();
    }
  
    return res;
  }

  // let centerPoint
  // if(radiusFilter){
  //   const {coordinates} = radiusFilter.feature.geometry;
  //   centerPoint = L.latLng(coordinates[1], coordinates[0])
  // }
  
  // const layer = data.features
  //   .filter((currentFeature) => {
  //     let filterByRadius;
  //     let filterByGeo;
  //     if(centerPoint){
  //       const {coordinates} = currentFeature.geometry;
  //       const currentPoint = L.latLng(coordinates[1], coordinates[0])
  //       filterByRadius = centerPoint.distanceTo(currentPoint) / 1000 < radiusFilter.radius
  //     }

  //     if (geoFilter){
  //       filterByGeo = booleanPointInPolygon(currentFeature, geoFilter)
  //     }

  //     let doFilter = true
  //     if(geoFilter && radiusFilter){
  //       doFilter = filterByRadius && filterByGeo
  //     } else if (geoFilter && !radiusFilter){
  //       doFilter = filterByGeo
  //     } else if (radiusFilter && !geoFilter){
  //       doFilter = filterByRadius
  //     }
  //     return doFilter
  //   })

    console.log('clusters',clusters);
    const layer = clusters.map((cluster, i) => {
    const {coordinates} = cluster.geometry;
    const {
      cluster: isCluster,
      point_count: pointCount,
      opacity
    } = cluster.properties;

    if(isCluster){      
      return (<Marker
        key={`cluster-${cluster.id}`}
        position={[coordinates[1], coordinates[0]]} 
        icon={fetchIcon(
          pointCount,
          10 + (pointCount / data.length) * 40
        )}
        opacity={opacity ?? 1}
        eventHandlers={{
          click: (e) => {
            if (map.getZoom() === map.getMaxZoom()){

              cluster.properties.opacity = 0.5
              const markers = supercluster.getLeaves(cluster.properties.cluster_id)
              //getLeaves does have pagination, default limit 10 (clusterId, limit, offset)
              const positions = generatePointsCircle(markers.length, map.latLngToLayerPoint(new L.LatLng(coordinates[1], coordinates[0])))

              markers.forEach((childMarker, i) => {
                const newPos = map.layerPointToLatLng(positions[i]);
                const leg = new L.Polyline([new L.LatLng(coordinates[1], coordinates[0]), newPos])
                const singleMarker = new L.GeoJSON({
                  ...childMarker,
                  geometry: {
                    ...childMarker.geometry,
                    coordinates: [Number(newPos.lng), Number(newPos.lat)]
                  }
                },{
                  pointToLayer: (feature, latlng) => {
                    return new L.Marker(latlng, {icon: defaultIcon})
                  }
                })

                map.addLayer(leg);
                map.addLayer(singleMarker);
                map.once('dragend', () => leg.removeFrom(map))
                map.once('dragend', () => singleMarker.removeFrom(map))
              })
              
              updateMap();
            }
          }
        }}
      />)
    }

    return (<Marker 
        key={i} 
        position={[coordinates[1], coordinates[0]]} 
        icon={defaultIcon}
        doFilterBounds={true}
      >
        <Popup>
          <PopupStats feature={cluster} setRadiusFilter={setRadiusFilter} />
        </Popup>
      </Marker>)

    })

  useEffect(() => {
    updateMap();
    map.on('moveend', updateMap);
    map.on('zoomend', () => console.log(map.getZoom()));
    return () => {
      map.off('moveend', updateMap);
    }
  },[]);
  
  return (
    <LayersControl.Overlay
      checked
      name="Cities"
    >
      <LayerGroup>
        {layer}
      </LayerGroup>
    </LayersControl.Overlay>
  )
}
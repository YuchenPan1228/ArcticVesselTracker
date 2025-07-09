import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [177.72, 64.65],
      zoom: 5
    });

    fetch('/api/vessels')
      .then(res => res.json())
      .then(data => {
        map.addSource('ships', {
          type: 'geojson',
          data
        });

        map.addLayer({
          id: 'ship-points',
          type: 'circle',
          source: 'ships',
          paint: {
            'circle-radius': 4,
            'circle-color': '#00f'
          }
        });
      });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;

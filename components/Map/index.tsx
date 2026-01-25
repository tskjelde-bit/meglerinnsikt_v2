import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useRef, useEffect, useState } from 'react';
import Mapbox, { Marker, NavigationControl, Source, Layer, MapRef } from 'react-map-gl';
import type mapboxgl from 'mapbox-gl';
import { Box, Card, Group, Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import classes from './Map.module.css';
import { useMap } from '@/context/Map';
import { cssHalfMainSize, cssMainSize } from '@/theme';
import { snapMapStyle } from './snapMapStyle';
import { prefixPath } from '@/utils/path';

const districtColors: Record<string, string> = {
  'Alna': '#FF4C4C',
  'Bjerke': '#FF7F11',
  'Frogner': '#FFC300',
  'Gamle Oslo': '#9EE01A',
  'Grorud': '#4BE8CC',
  'Grünerløkka': '#00BFFF',
  'Nordre Aker': '#339CFF',
  'Nordstrand': '#7A5CFA',
  'Sagene': '#C084FC',
  'Sentrum': '#F472B6',
  'St. Hanshaugen': '#FF3F6C',
  'Stovner': '#D98E73',
  'Søndre Nordstrand': '#4DD0E1',
  'Ullern': '#A8E6A1',
  'Vestre Aker': '#779ECB',
  'Østensjø': '#FFE066'
};

function Map() {
  const sm = useMediaQuery('(max-width: 48em)');
  const { center, setCenter, selectedDistrict, setSelectedDistrict } = useMap();
  const mapRef = useRef<MapRef>(null);

  const [hoveredDistrict, setHoveredDistrict] = React.useState<string | null>(null);

  // Swarm Animation State
  const [swarmOffsets, setSwarmOffsets] = useState<Record<string, { x: number, y: number, duration: string }>>({});
  const [animationStarted, setAnimationStarted] = useState(false);

  // Fetch label points
  const [labelFeatures, setLabelFeatures] = React.useState<any[]>([]);

  useEffect(() => {
    fetch(prefixPath('/oslo_label_points.geojson?v=2'))
      .then(res => res.json())
      .then(data => {
        if (data.features) {
          setLabelFeatures(data.features);
        }
      })
      .catch(err => console.error('Error loading labels:', err));
  }, []);

  const [isLoaded, setIsLoaded] = React.useState(false);

  // Animation Sequence
  useEffect(() => {
    if (isLoaded && labelFeatures.length > 0 && mapRef.current) {
      const timer = setTimeout(() => {
        if (!mapRef.current) return;
        const map = mapRef.current.getMap();
        const canvas = map.getCanvas();
        const originX = canvas.width - 50;
        const originY = 50;

        const offsets: Record<string, { x: number, y: number, duration: string }> = {};

        labelFeatures.forEach(feature => {
          const name = feature.properties?.BYDELSNAVN;
          const coords = feature.geometry.coordinates;
          if (name && coords) {
            const point = map.project([coords[0], coords[1]]);
            offsets[name] = {
              x: originX - point.x,
              y: originY - point.y,
              duration: (Math.random() * 1.5 + 2.0).toFixed(2) + 's'
            };
          }
        });

        setSwarmOffsets(offsets);
        setAnimationStarted(true);

        map.flyTo({
          center: [10.79, 59.93],
          zoom: 11.0,
          bearing: -15,
          pitch: 10,
          duration: 3500,
          essential: true
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, labelFeatures]);

  const onHover = React.useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature && feature.properties?.BYDELSNAVN) {
      setHoveredDistrict(feature.properties.BYDELSNAVN);
    } else {
      setHoveredDistrict(null);
    }
  }, []);

  const onClick = React.useCallback((event: mapboxgl.MapLayerMouseEvent) => {
    const feature = event.features && event.features[0];
    if (feature && feature.properties?.BYDELSNAVN) {
      setSelectedDistrict(feature.properties.BYDELSNAVN);
    } else {
      setSelectedDistrict(null);
    }
  }, [setSelectedDistrict]);

  // Handle CSS height safe for SSR hydration
  const mapHeight = sm !== undefined ? (sm ? cssHalfMainSize : cssMainSize) : cssMainSize;

  return (
    <Box className={classes.box}>
      <Mapbox
        ref={mapRef}
        key="map-vStandardConfig"
        initialViewState={center}
        onMove={(evt) => setCenter(evt.viewState)}
        onClick={onClick}
        onMouseMove={onHover}
        onMouseLeave={() => setHoveredDistrict(null)}
        onLoad={(evt) => {
          setIsLoaded(true);
        }}
        interactiveLayerIds={['bydel-polygons']}
        cursor={hoveredDistrict ? 'pointer' : 'auto'}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle={snapMapStyle as any}
        onError={(e) => console.error('Mapbox Error:', e)}
        style={{ width: '100%', height: mapHeight }}
      >
        <NavigationControl />

        {/* Floating Instruction Card */}
        <Box pos="absolute" top={20} right={50} style={{ zIndex: 10 }}>
          <Card
            shadow="sm"
            padding="sm"
            radius="md"
            withBorder
            style={{
              backgroundColor: 'white',
              maxWidth: 280
            }}
          >
            <Group align="flex-start" wrap="nowrap" gap="xs">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke="currentColor">
                <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Stack gap={2}>
                <Text size="sm" fw={700} c="gray.9">
                  Utforsk boligprisene i Oslo
                </Text>
                <Text size="xs" c="dimmed">
                  Klikk på en bydel for å se nøkkeltall.
                </Text>
              </Stack>
            </Group>
          </Card>
        </Box>

        {isLoaded && (
          <>
            <Source id="oslo-bydeler" type="geojson" data={prefixPath('/oslo_bydeler.geojson?v=5')}>
              <Layer
                id="bydel-polygons"
                type="fill"
                paint={{
                  'fill-color': [
                    'case',
                    ['==', ['get', 'BYDELSNAVN'], selectedDistrict || ''], 'rgba(90,174,255,0.32)',
                    ['==', ['get', 'BYDELSNAVN'], hoveredDistrict || ''], 'rgba(90,174,255,0.22)',
                    'rgba(0,0,0,0)'
                  ],
                  'fill-color-transition': { duration: 200 }
                }}
              />
              <Layer
                id="bydel-outlines"
                type="line"
                paint={{
                  'line-color': [
                    'case',
                    ['==', ['get', 'BYDELSNAVN'], selectedDistrict || ''], '#2F8CFF',
                    ['==', ['get', 'BYDELSNAVN'], hoveredDistrict || ''], '#5AAEFF',
                    'rgba(0,0,0,0)'
                  ],
                  'line-width': [
                    'case',
                    ['==', ['get', 'BYDELSNAVN'], selectedDistrict || ''], 2,
                    ['==', ['get', 'BYDELSNAVN'], hoveredDistrict || ''], 1.5,
                    0
                  ],
                  'line-color-transition': { duration: 200 },
                  'line-width-transition': { duration: 200 }
                }}
              />
            </Source>

            {labelFeatures.map((feature, index) => {
              const districtName = feature.properties?.BYDELSNAVN;
              const isHovered = districtName === hoveredDistrict;
              const isSelected = districtName === selectedDistrict;
              const isActive = isHovered || isSelected;
              const isDimmed = !!hoveredDistrict && !isHovered;

              const coords = feature.geometry.coordinates;
              const offset = swarmOffsets[districtName];
              const pinColor = '#94a3b8';

              if (!animationStarted || !offset) return null;

              return (
                <Marker
                  key={`swarm-label-${index}`}
                  latitude={coords[1]}
                  longitude={coords[0]}
                  style={{ zIndex: isActive ? 100 : (isDimmed ? 5 : 10) }}
                >
                  <div style={{ position: 'relative' }}>
                    <div
                      className={classes.flyInX}
                      style={{
                        '--dx': `${offset.x}px`,
                        animationDuration: offset.duration
                      } as React.CSSProperties}
                    >
                      <div
                        className={classes.flyInY}
                        style={{
                          '--dy': `${offset.y}px`,
                          animationDuration: offset.duration,
                        } as React.CSSProperties}
                      >
                        <div
                          className={`${classes.pinContainer} ${isActive ? classes.active : ''} ${isDimmed ? classes.dimmed : ''}`}
                          onMouseEnter={() => setHoveredDistrict(districtName)}
                          style={{
                            '--district-color': pinColor,
                          } as React.CSSProperties}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <svg viewBox="0 0 24 24" className={classes.mapPin} style={{ fill: 'currentColor' }}>
                              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              <circle cx="12" cy="9" r="3.5" fill="white" />
                            </svg>
                            <div className={classes.label}>
                              {districtName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Marker>
              );
            })}
          </>
        )}
      </Mapbox>
    </Box>
  );
}

export default Map;

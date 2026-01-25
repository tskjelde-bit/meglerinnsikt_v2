import { Style } from 'mapbox-gl';

export const snapMapStyle: Style = {
    version: 8,
    name: 'Snap Map Style',

    sources: {
        composite: {
            url: 'mapbox://mapbox.mapbox-streets-v8',
            type: 'vector',
        },
        label_points: {
            type: 'geojson',
            data: '/oslo_label_points.geojson?v=2'
        }
    },
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    layers: [
        // 1. BACKGROUND
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#E9F3DD',
            },
        },
        // ... (Existing layers) ...


        // 2. URBAN / LANDUSE FLAT
        {
            id: 'landuse-residential',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landuse',
            filter: ['in', 'class', 'residential', 'commercial', 'industrial', 'civic', 'hospital', 'school'],
            paint: {
                'fill-color': '#F1F3ED',
            },
        },

        // 3. NATURE / PARKS / FOREST
        // Parks (Small green)
        {
            id: 'landuse-park',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landuse',
            filter: ['in', 'class', 'park', 'pitch', 'grass'],
            paint: {
                'fill-color': '#C8E8B6',
            },
        },
        // Forests (Large green)
        {
            id: 'landcover-wood',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landcover',
            filter: ['in', 'class', 'wood', 'grass', 'scrub'],
            paint: {
                'fill-color': '#B4E09C',
            },
        },

        // 4. WATER
        // Main Water
        {
            id: 'water',
            type: 'fill',
            source: 'composite',
            'source-layer': 'water',
            paint: {
                'fill-color': '#7EC8F2',
            },
        },
        // Rivers / Streams (Detailed)
        {
            id: 'waterway',
            type: 'line',
            source: 'composite',
            'source-layer': 'waterway',
            paint: {
                'line-color': '#8FD2F6',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.5, 15, 2], // ~30-40% reduced
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },

        // 5. ROADS
        // Minor Roads (White)
        {
            id: 'road-minor',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'street', 'service', 'path'],
            paint: {
                'line-color': '#FFFFFF',
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.5, 15, 3], // Reduced significantly
                'line-opacity': 0.9,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },
        // Major Roads 1: Motorway (Darker Yellow)
        {
            id: 'road-motorway',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'motorway', 'motorway_link'],
            paint: {
                'line-color': '#E9B83A',
                'line-width': ['interpolate', ['linear'], ['zoom'],
                    5, 0.55,   // Reduced 35% on low zoom
                    10, 0.85,  // Standard logic start
                    15, 3.4    // Standard width
                ],
                'line-opacity': ['interpolate', ['linear'], ['zoom'],
                    5, 0.55,   // Faded on low zoom
                    10, 0.80   // Visible on high zoom
                ],
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },
        // Major Roads 2: Trunk (Lighter Yellow, Thinner)
        {
            id: 'road-trunk',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'trunk', 'trunk_link'],
            paint: {
                'line-color': '#F1CF6A', // Lighter
                'line-width': ['interpolate', ['linear'], ['zoom'],
                    5, 0.44,   // 20% thinner than motorway
                    10, 0.68,
                    15, 2.7
                ],
                'line-opacity': ['interpolate', ['linear'], ['zoom'],
                    5, 0.55,
                    10, 0.80
                ],
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },

        // 6. BUILDINGS
        {
            id: 'building',
            type: 'fill-extrusion',
            source: 'composite',
            'source-layer': 'building',
            paint: {
                'fill-extrusion-color': '#E3E5DF',
                'fill-extrusion-opacity': 0.9,
                'fill-extrusion-height': ['*', ['get', 'height'], 0.7], // Reduced height by 30%
                'fill-extrusion-base': ['get', 'min_height'],
            },
        },

        // 7. LABELS & PINS (From label_points source)
        // Label Layer
        {
            id: 'bydel-labels',
            type: 'symbol',
            source: 'label_points',
            layout: {
                'text-field': ['get', 'BYDELSNAVN'],
                'text-font': ['Arial Unicode MS Regular'], // Safe fallback
                'text-size': 14,
                'text-transform': 'uppercase',
                'text-letter-spacing': 0.05,
                'text-anchor': 'top',
                'text-offset': [0, 0.8],
                'text-allow-overlap': true
            },
            paint: {
                'text-color': '#0f172a',
                'text-halo-color': 'rgba(255,255,255,0)',
                'text-halo-width': 0,
                'text-halo-blur': 0,
                'text-opacity': 0, // Hidden (Replaced by HTML Swarm)
            },
        },
        // Pin/Dot Layer
        {
            id: 'bydel-dots',
            type: 'circle',
            source: 'label_points',
            paint: {
                'circle-color': '#3B82F6',
                'circle-radius': 4,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
                'circle-opacity': 0, // Hidden (Replaced by HTML Swarm)
                'circle-stroke-opacity': 0,
            },
        },
    ],
};

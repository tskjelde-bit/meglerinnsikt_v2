import { Style } from 'mapbox-gl';

export const kartMapStyle: Style = {
    version: 8,
    name: 'Kart Minimal Style',

    sources: {
        composite: {
            url: 'mapbox://mapbox.mapbox-streets-v8',
            type: 'vector',
        },
    },
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    layers: [
        // 1. BACKGROUND – very light, near-white
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#f8f9fb',
            },
        },

        // 2. LANDUSE – barely visible
        {
            id: 'landuse-residential',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landuse',
            filter: ['in', 'class', 'residential', 'commercial', 'industrial', 'civic', 'hospital', 'school'],
            paint: {
                'fill-color': '#f3f4f6',
                'fill-opacity': 0.5,
            },
        },

        // 3. PARKS / FOREST – very subtle
        {
            id: 'landuse-park',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landuse',
            filter: ['in', 'class', 'park', 'pitch', 'grass'],
            paint: {
                'fill-color': '#eef2ee',
                'fill-opacity': 0.4,
            },
        },
        {
            id: 'landcover-wood',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landcover',
            filter: ['in', 'class', 'wood', 'grass', 'scrub'],
            paint: {
                'fill-color': '#edf1ed',
                'fill-opacity': 0.35,
            },
        },

        // 4. WATER – very toned down
        {
            id: 'water',
            type: 'fill',
            source: 'composite',
            'source-layer': 'water',
            paint: {
                'fill-color': '#e8eef4',
                'fill-opacity': 0.6,
            },
        },
        {
            id: 'waterway',
            type: 'line',
            source: 'composite',
            'source-layer': 'waterway',
            paint: {
                'line-color': '#dce4ed',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 15, 1],
                'line-opacity': 0.4,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },

        // 5. ROADS – extremely subtle, no color
        {
            id: 'road-minor',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'street', 'service', 'path'],
            paint: {
                'line-color': '#e5e7eb',
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.3, 15, 1.5],
                'line-opacity': 0.5,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },
        {
            id: 'road-motorway',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'motorway', 'motorway_link'],
            paint: {
                'line-color': '#d1d5db',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 10, 0.6, 15, 2],
                'line-opacity': 0.4,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },
        {
            id: 'road-trunk',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'trunk', 'trunk_link'],
            paint: {
                'line-color': '#d1d5db',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.25, 10, 0.5, 15, 1.6],
                'line-opacity': 0.4,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },

        // 6. BUILDINGS – flat, barely visible
        {
            id: 'building',
            type: 'fill',
            source: 'composite',
            'source-layer': 'building',
            paint: {
                'fill-color': '#ebedf0',
                'fill-opacity': 0.3,
            },
        },

        // NO labels, NO POI, NO transit, NO road shields
    ],
};

import { Style } from 'mapbox-gl';

export const kartMapStyle: Style = {
    version: 8,
    name: 'Meglerinnsikt Minimal',

    sources: {
        composite: {
            url: 'mapbox://mapbox.mapbox-streets-v8',
            type: 'vector',
        },
    },
    glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
    layers: [
        // 1. BACKGROUND – slate-50
        {
            id: 'background',
            type: 'background',
            paint: {
                'background-color': '#F8FAFC',
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
                'fill-color': '#F1F5F9',
                'fill-opacity': 0.4,
            },
        },

        // 3. PARKS / FOREST – very subtle green tint
        {
            id: 'landuse-park',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landuse',
            filter: ['in', 'class', 'park', 'pitch', 'grass'],
            paint: {
                'fill-color': '#F0F4F0',
                'fill-opacity': 0.35,
            },
        },
        {
            id: 'landcover-wood',
            type: 'fill',
            source: 'composite',
            'source-layer': 'landcover',
            filter: ['in', 'class', 'wood', 'grass', 'scrub'],
            paint: {
                'fill-color': '#EFF3EF',
                'fill-opacity': 0.3,
            },
        },

        // 4. WATER – very subtle blue-gray
        {
            id: 'water',
            type: 'fill',
            source: 'composite',
            'source-layer': 'water',
            paint: {
                'fill-color': '#EDF1F7',
                'fill-opacity': 0.5,
            },
        },
        {
            id: 'waterway',
            type: 'line',
            source: 'composite',
            'source-layer': 'waterway',
            paint: {
                'line-color': '#E2E8F0',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.3, 15, 0.8],
                'line-opacity': 0.3,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },

        // 5. ROADS – ghosted
        {
            id: 'road-minor',
            type: 'line',
            source: 'composite',
            'source-layer': 'road',
            filter: ['in', 'class', 'primary', 'secondary', 'tertiary', 'street', 'service', 'path'],
            paint: {
                'line-color': '#E2E8F0',
                'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.2, 15, 1],
                'line-opacity': 0.35,
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
                'line-color': '#E2E8F0',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.2, 10, 0.5, 15, 1.5],
                'line-opacity': 0.3,
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
                'line-color': '#E2E8F0',
                'line-width': ['interpolate', ['linear'], ['zoom'], 5, 0.2, 10, 0.4, 15, 1.2],
                'line-opacity': 0.3,
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'round',
            },
        },

        // 6. BUILDINGS – ghosted
        {
            id: 'building',
            type: 'fill',
            source: 'composite',
            'source-layer': 'building',
            paint: {
                'fill-color': '#E2E8F0',
                'fill-opacity': 0.2,
            },
        },

        // NO labels, NO POI, NO transit, NO road shields
    ],
};

import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { useLocalStorage, useDebouncedValue } from '@mantine/hooks';

export type MapCenter = {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
};

export type MapMarker = {
  location: {
    lat: number;
    lng: number;
  };
  label: string;
};

export type MapContextType = {
  center: MapCenter;
  markers: MapMarker[];
  setCenter: (center: MapCenter) => void;
  addMarkers: (markers: MapMarker[]) => void;
  selectedDistrict: string | null;
  setSelectedDistrict: (district: string | null) => void;
  droppedDistricts: string[];
  setDroppedDistricts: (districts: string[]) => void;
};

const DEFAULT_VIEWPORT = {
  latitude: 59.93,
  longitude: 10.75,
  zoom: 9.8,
  bearing: -15, // Start skewed/rotated
  pitch: 0,
};

const MapContext = createContext<MapContextType>({
  center: DEFAULT_VIEWPORT,
  markers: [],
  setCenter: () => { },
  addMarkers: () => { },
  selectedDistrict: null,
  setSelectedDistrict: () => { },
  droppedDistricts: [],
  setDroppedDistricts: () => { },
});

export const MapProvider = ({ children }: { children: ReactNode }) => {
  // Use local state for high-frequency updates (animation)
  const [center, setCenter] = useState<MapCenter>(DEFAULT_VIEWPORT);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('mapCenter_v9');
      if (stored) {
        setCenter(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('Failed to parse map center from local storage', e);
    }
  }, []);

  // Persist to LocalStorage using debounce to prevent blocking the main thread during animations
  const [debouncedCenter] = useDebouncedValue(center, 500);

  useEffect(() => {
    localStorage.setItem('mapCenter_v9', JSON.stringify(debouncedCenter));
  }, [debouncedCenter]);

  // Markers can still use direct useLocalStorage as they update infrequently
  const [markers, setMarkers] = useLocalStorage<MapMarker[]>({
    key: 'mapMarkers',
    defaultValue: [],
  });

  const setCenterCallback = useCallback(
    (newCenter: MapCenter) => {
      setCenter(newCenter);
    },
    []
  );

  const addMarkers = useCallback(
    (newMarkers: MapMarker[]) => {
      setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
    },
    [setMarkers]
  );

  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [droppedDistricts, setDroppedDistricts] = useState<string[]>([]);

  return (
    <MapContext.Provider value={{
      center,
      markers,
      setCenter: setCenterCallback,
      addMarkers,
      selectedDistrict,
      setSelectedDistrict,
      droppedDistricts,
      setDroppedDistricts
    }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

export default MapContext;

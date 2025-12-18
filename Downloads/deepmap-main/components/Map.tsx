import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { Scan, Navigation, Loader2 } from 'lucide-react';
import { Place, Coordinates, RouteData } from '../types';
import { DEFAULT_CENTER, DEFAULT_ZOOM, MAP_TILE_LAYER, MAP_ATTRIBUTION } from '../constants';

// Helper function to validate coordinates
const isValidCoord = (lat: number, lng: number): boolean => {
  return typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng);
};

// Helper component to update map view when center changes
const MapUpdater: React.FC<{ center: Coordinates, zoom?: number, userLocation: Coordinates | null, isNavigating: boolean, routeData?: RouteData | null, isFollowingUser: boolean }> = ({ center, zoom, userLocation, isNavigating, routeData, isFollowingUser }) => {
  const map = useMap();
  const lastAppliedCenter = useRef<Coordinates | null>(null);
  const lastAppliedZoom = useRef<number | null>(null);

  useEffect(() => {
    // Force a resize check when the map updates
    map.invalidateSize();

    // If we have route data, fit bounds to it (only initially or if route changes)
    // BUT if following user, prioritize user location
    if (routeData && routeData.coordinates.length > 0 && !isFollowingUser) {
      const bounds = L.latLngBounds(routeData.coordinates);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
      return;
    }

    // Follow User Mode (Navigating OR Explicit Follow)
    if ((isNavigating || isFollowingUser) && userLocation && isValidCoord(userLocation.lat, userLocation.lng)) {
      const currentCenter = map.getCenter();
      const dist = Math.sqrt(
        Math.pow(currentCenter.lat - userLocation.lat, 2) +
        Math.pow(currentCenter.lng - userLocation.lng, 2)
      );

      // Follow user if they've moved more than a small threshold
      if (dist > 0.0001) { // Approx 10 meters
        try {
          map.setView([userLocation.lat, userLocation.lng], map.getZoom(), {
            animate: true,
            duration: 1.0, // Smooth glide
            easeLinearity: 0.25
          });
        } catch (e) {
          console.warn("Navigation map update error:", e);
        }
      }
      return;
    }

    // Normal center update logic when not navigating/following
    if (!center || !isValidCoord(center.lat, center.lng)) return;

    const targetZoom = zoom || map.getZoom();

    // Check if props have actually changed since last application
    const centerChanged = !lastAppliedCenter.current ||
      Math.abs(lastAppliedCenter.current.lat - center.lat) > 0.000001 ||
      Math.abs(lastAppliedCenter.current.lng - center.lng) > 0.000001;

    const zoomChanged = lastAppliedZoom.current !== targetZoom;

    // Only update the map if the PROPS have changed
    if (centerChanged || zoomChanged) {
      try {
        map.setView([center.lat, center.lng], targetZoom, {
          animate: true,
          duration: 1.5,
          easeLinearity: 0.25
        });
        lastAppliedCenter.current = center;
        lastAppliedZoom.current = targetZoom;
      } catch (e) {
        console.warn("Map update error:", e);
      }
    }
  }, [center, zoom, userLocation, isNavigating, map, routeData, isFollowingUser]);
  return null;
};

// Component to listen to map events and notify parent
const MapEventHandler: React.FC<{ onMapChange?: (center: Coordinates, zoom: number) => void, onMapClick?: (coords: Coordinates) => void, onUserInteraction?: () => void }> = ({ onMapChange, onMapClick, onUserInteraction }) => {
  useMapEvents({
    moveend: (e) => {
      if (onMapChange) {
        const map = e.target;
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMapChange({ lat: center.lat, lng: center.lng }, zoom);
      }
    },
    zoomend: (e) => {
      if (onMapChange) {
        const map = e.target;
        const center = map.getCenter();
        const zoom = map.getZoom();
        onMapChange({ lat: center.lat, lng: center.lng }, zoom);
      }
    },
    click: (e) => {
      if (onMapClick) {
        onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
      }
    },
    dragstart: () => {
      if (onUserInteraction) onUserInteraction();
    }
  });
  return null;
};

// Control to fit all markers in view
const FitBoundsControl: React.FC<{ places: Place[] }> = ({ places }) => {
  const map = useMap();

  const fitBounds = () => {
    // Filter out invalid places before creating bounds
    const validPlaces = places.filter(p => p.coordinates && isValidCoord(p.coordinates.lat, p.coordinates.lng));

    if (validPlaces.length === 0) return;

    const latLngs = validPlaces.map(p => [p.coordinates.lat, p.coordinates.lng] as [number, number]);

    try {
      const bounds = L.latLngBounds(latLngs);
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 15,
          animate: true,
          duration: 1.5
        });
      }
    } catch (e) {
      console.warn("Fit bounds error:", e);
    }
  };

  if (places.length === 0) return null;

  return (
    <button
      onClick={fitBounds}
      className="group flex items-center justify-center w-10 h-10 bg-slate-900/90 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
      title="Fit all locations"
    >
      <Scan className="w-5 h-5 group-hover:scale-110 transition-transform" />
    </button>
  );
};

// Helper component for Routing
const RoutingControl: React.FC<{ start: Coordinates | null, end: Coordinates | null }> = ({ start, end }) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Control | null>(null);

  useEffect(() => {
    if (!start || !end || !isValidCoord(start.lat, start.lng) || !isValidCoord(end.lat, end.lng)) {
      // Remove control if points are missing
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
      return;
    }

    // If control doesn't exist, create it
    if (!routingControlRef.current) {
      // @ts-ignore - Leaflet Routing Machine types might be tricky
      routingControlRef.current = L.Routing.control({
        waypoints: [
          L.latLng(start.lat, start.lng),
          L.latLng(end.lat, end.lng)
        ],
        routeWhileDragging: false,
        showAlternatives: false,
        fitSelectedRoutes: true,
        show: false, // Hide the instruction panel by default to keep UI clean
        lineOptions: {
          styles: [{ color: '#22d3ee', opacity: 0.8, weight: 6 }], // Cyan neon look
          extendToWaypoints: false,
          missingRouteTolerance: 0
        },
        createMarker: () => null // We already have our own markers
      } as any).addTo(map);
    } else {
      // Update waypoints if control exists
      routingControlRef.current.setWaypoints([
        L.latLng(start.lat, start.lng),
        L.latLng(end.lat, end.lng)
      ]);
    }

    return () => {
      // Cleanup on unmount
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }
    };
  }, [start, end, map]);

  return null;
};

// Control to fly to user location
interface LocateControlProps {
  onLocate: () => void;
  isLocating: boolean;
}

const LocateControl: React.FC<LocateControlProps> = ({ onLocate, isLocating }) => {
  return (
    <button
      onClick={onLocate}
      disabled={isLocating}
      className="group flex items-center justify-center w-10 h-10 bg-slate-900/90 text-cyan-400 rounded-lg border border-cyan-500/30 hover:bg-slate-800 hover:border-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
      title="My Location"
    >
      {isLocating ? (
        <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
      ) : (
        <Navigation className="w-5 h-5 group-hover:scale-110 transition-transform" />
      )}
    </button>
  );
};

// Custom Neon Icons Generator
const createNeonIcon = (color: 'cyan' | 'pink' | 'yellow', isSelected: boolean) => {
  const colors = {
    cyan: { text: '#22d3ee', shadow: '#0891b2' },   // Cyan-400
    pink: { text: '#e879f9', shadow: '#c026d3' },   // Fuchsia-400
    yellow: { text: '#facc15', shadow: '#ca8a04' }, // Yellow-400
  };

  const c = colors[color];
  const scale = isSelected ? 'scale-125' : 'scale-100';
  const zIndex = isSelected ? 'z-[1000]' : 'z-[500]'; // Ensure selected is always on top

  const html = `
    <div class="relative flex flex-col items-center justify-center transition-transform duration-300 ${scale} ${zIndex}">
      <div class="w-10 h-10 rounded-full border-2 bg-slate-900 flex items-center justify-center shadow-[0_0_15px_${c.shadow}]" style="border-color: ${c.text};">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${c.text}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      </div>
      <div class="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] -mt-[1px]" style="border-top-color: ${c.text};"></div>
    </div>
  `;

  return L.divIcon({
    className: 'bg-transparent',
    html: html,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50]
  });
};

interface PlaceMarkerProps {
  place: Place;
  color: 'cyan' | 'pink' | 'yellow';
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const PlaceMarker: React.FC<PlaceMarkerProps> = ({ place, color, isSelected, onSelect }) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      const handler = () => onSelect(place.id);
      marker.on('click', handler);
      return () => {
        marker.off('click', handler);
      };
    }
  }, [place.id, onSelect]);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker && isSelected) {
      marker.setZIndexOffset(1000); // Bring to front when selected
    } else if (marker) {
      marker.setZIndexOffset(0);
    }
  }, [isSelected]);

  // Defensive check for coordinates
  if (!place.coordinates || !isValidCoord(place.coordinates.lat, place.coordinates.lng)) {
    return null;
  }

  return (
    <Marker
      ref={markerRef}
      position={[place.coordinates.lat, place.coordinates.lng]}
      icon={createNeonIcon(color, isSelected)}
    >
      <Popup className="custom-popup">
        <div className="font-sans text-slate-800">
          <h3 className="font-bold text-sm mb-1">{place.name}</h3>
          <p className="text-xs text-gray-600">{place.address}</p>
        </div>
      </Popup>
    </Marker>
  );
};

interface MapProps {
  center: Coordinates;
  zoom?: number;
  places: Place[];
  selectedPlaceId: string | null;
  onPlaceSelect: (placeId: string) => void;
  userLocation: Coordinates | null;
  destinationLocation: Coordinates | null;
  onLocate: () => void;
  isLocating: boolean;
  isNavigating: boolean;
  onMapChange?: (center: Coordinates, zoom: number) => void;
  onMapClick?: (coords: Coordinates) => void;
  routeData?: RouteData | null;
  isFollowingUser?: boolean;
  onUserInteraction?: () => void;
}

export const Map: React.FC<MapProps> = ({
  center,
  zoom,
  places,
  selectedPlaceId,
  onPlaceSelect,
  userLocation,
  destinationLocation,
  onLocate,
  isLocating,
  isNavigating,
  onMapChange,
  onMapClick,
  routeData,
  isFollowingUser = false,
  onUserInteraction
}) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom || DEFAULT_ZOOM}
      className="w-full h-full bg-[#020617]"
      style={{ height: '100vh', width: '100vw' }}
      zoomControl={false}
    >
      <TileLayer
        attribution={MAP_ATTRIBUTION}
        url={MAP_TILE_LAYER}
        className="midnight-map-tiles"
      />

      {/* Map Updater Effect */}
      <MapUpdater center={center} zoom={zoom} userLocation={userLocation} isNavigating={isNavigating} routeData={routeData} isFollowingUser={isFollowingUser} />

      {/* Map Event Handler */}
      <MapEventHandler onMapChange={onMapChange} onMapClick={onMapClick} onUserInteraction={onUserInteraction} />

      {/* Routing Control - Only use if NO manual routeData */}
      {!routeData && <RoutingControl start={userLocation} end={destinationLocation || null} />}

      {/* Manual Route Polyline */}
      {routeData && (
        <Polyline
          positions={routeData.coordinates}
          pathOptions={{ color: '#22d3ee', weight: 6, opacity: 0.8, lineCap: 'round', lineJoin: 'round' }}
        />
      )}

      {/* Map Controls (Bottom Right - Stacked) */}
      <div className="absolute bottom-40 right-4 z-[400] flex flex-col gap-3 pointer-events-auto">
        <LocateControl onLocate={onLocate} isLocating={isLocating} />
        <FitBoundsControl places={places} />
      </div>

      {/* User Location Marker & Accuracy Circle */}
      {userLocation && isValidCoord(userLocation.lat, userLocation.lng) && (
        <>
          {/* Accuracy Circle */}
          {userLocation.accuracy && (
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy}
              pathOptions={{
                fillColor: '#22d3ee',
                fillOpacity: 0.1,
                color: '#22d3ee',
                opacity: 0.3,
                weight: 1
              }}
            />
          )}

          <Marker
            position={[userLocation.lat, userLocation.lng]}
            zIndexOffset={2000} // Ensure user marker is always on top
            icon={L.divIcon({
              className: 'bg-transparent transition-all duration-1000 ease-linear', // Smooth transition class
              // Explicitly sizing the container and content to match
              html: `
                <div class="relative w-4 h-4 flex items-center justify-center">
                  <div class="absolute w-4 h-4 bg-cyan-400 rounded-full border-2 border-white shadow-[0_0_15px_#22d3ee] z-20"></div>
                  <div class="absolute w-4 h-4 rounded-full bg-cyan-400/50 animate-ping z-10"></div>
                </div>
              `,
              iconSize: [16, 16], // Match the w-4 h-4 (16px)
              iconAnchor: [8, 8]  // Center point (half of 16)
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold mb-1">Start Location</p>
                {userLocation.accuracy && (
                  <p className="text-xs text-slate-400">Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                )}
              </div>
            </Popup>
          </Marker>
        </>
      )}

      {/* Destination Marker */}
      {destinationLocation && isValidCoord(destinationLocation.lat, destinationLocation.lng) && (
        <Marker
          position={[destinationLocation.lat, destinationLocation.lng]}
          zIndexOffset={1900}
          icon={createNeonIcon('pink', true)}
        >
          <Popup>
            <div className="text-center">
              <p className="font-bold mb-1">Destination</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Place Markers */}
      {places.map((place, index) => {
        // Skip if coordinates are invalid
        if (!place.coordinates || !isValidCoord(place.coordinates.lat, place.coordinates.lng)) {
          return null;
        }

        // Cycle through colors for variety: Cyan, Pink, Yellow
        const colors: ('cyan' | 'pink' | 'yellow')[] = ['cyan', 'pink', 'yellow'];
        const color = colors[index % colors.length];

        return (
          <PlaceMarker
            key={place.id}
            place={place}
            color={color}
            isSelected={selectedPlaceId === place.id}
            onSelect={onPlaceSelect}
          />
        );
      })}

      <style>{`
        /* Dark mode popup tweaks */
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background: #1e293b;
          color: #f8fafc;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
        }
        .leaflet-popup-content h3 {
          color: #f8fafc !important;
        }
        .leaflet-popup-content p {
          color: #cbd5e1 !important;
        }
        /* Smooth marker transition */
        .leaflet-marker-icon {
          transition: transform 0.5s linear;
        }
      `}</style>
    </MapContainer>
  );
};
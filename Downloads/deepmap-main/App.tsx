import React, { useState, useEffect, useRef } from 'react';
import { Map as MapComponent } from './components/Map';
import { PlaceCard } from './components/PlaceCard';

import { RoutePlanner } from './components/RoutePlanner';
import { sendMessageToGemini } from './services/geminiService';
import { Place, ChatMessage, Coordinates, AppState, RouteData } from './types';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from './constants';
import { Search, Compass, Loader2, Send, X, Sparkles, AlertCircle, Navigation } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates>(DEFAULT_CENTER);
  const [mapZoom, setMapZoom] = useState<number>(DEFAULT_ZOOM);

  // Location State
  const [gpsLocation, setGpsLocation] = useState<Coordinates | null>(null);
  const [manualLocation, setManualLocation] = useState<Coordinates | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<Coordinates | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFollowingUser, setIsFollowingUser] = useState(false);

  // Route Planner State
  const [isRoutePlannerOpen, setIsRoutePlannerOpen] = useState(false);
  const [routeData, setRouteData] = useState<RouteData | null>(null);

  // Derived state: User location is manual if set, otherwise GPS
  const userLocation = manualLocation || gpsLocation;

  const [isLocating, setIsLocating] = useState(false);
  const [query, setQuery] = useState('');
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Helper to get high-accuracy location
  const startLocationWatch = (onSuccess?: (coords: Coordinates) => void, onError?: (msg: string) => void) => {
    if (!navigator.geolocation) {
      if (onError) onError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    setErrorText(null);

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
          const coords = { lat, lng, accuracy };
          setGpsLocation(coords);
          if (onSuccess) onSuccess(coords);
        }
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation access denied or failed", error);
        let msg = "Unable to retrieve your location.";
        if (error.code === 1) msg = "Location access denied. Please enable permissions.";
        if (error.code === 3) msg = "Location request timed out.";

        if (onError) onError(msg);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true, // Use GPS/High accuracy
        timeout: 10000,
        maximumAge: 0 // Do not use cached position
      }
    );

    return watchId;
  };

  // Initialize: Watch User Location on mount
  useEffect(() => {
    const watchId = startLocationWatch((coords) => {
      // Optional: Set center to user on load if desired
      // setMapCenter(coords); 
    });

    return () => {
      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const handleManualLocate = () => {
    // If manual location is set, clear it to revert to GPS
    if (manualLocation) {
      setManualLocation(null);
      setAiResponseText("Switched back to GPS location.");
      setIsFollowingUser(true); // Auto-follow on switch back
      if (gpsLocation) {
        setMapCenter(gpsLocation);
        setMapZoom(16);
      }
      return;
    }

    // Toggle follow mode
    if (isFollowingUser) {
      setIsFollowingUser(false);
      setAiResponseText("Stopped following your location.");
    } else {
      setIsFollowingUser(true);
      setAiResponseText("Following your location.");
      // Force center immediately
      if (gpsLocation) {
        setMapCenter(gpsLocation);
        setMapZoom(16);
      }
    }

    // Ensure we have a location
    if (!gpsLocation) {
      startLocationWatch(
        (coords) => {
          setMapCenter(coords);
          setMapZoom(16);
          setIsFollowingUser(true);
          setAiResponseText("Located you successfully.");
          setSelectedPlaceId(null);
        },
        (errorMsg) => setAiResponseText(errorMsg)
      );
    }
  };

  const handleLocationSelect = (coords: Coordinates, type: 'start' | 'destination') => {
    if (type === 'start') {
      setManualLocation(coords);
      setMapCenter(coords);
      setMapZoom(16);
      setIsFollowingUser(false); // Disable follow on manual set
      setAiResponseText(`Start location set.`);
    } else {
      setDestinationLocation(coords);
      setMapCenter(coords); // Pan to destination to show it
      setMapZoom(16);
      setIsFollowingUser(false); // Disable follow to show dest
      setAiResponseText(`Destination set.`);
    }
  };

  const handleLocationClear = (type: 'start' | 'destination') => {
    if (type === 'start') {
      setManualLocation(null);
      setAiResponseText("Start location cleared. Using GPS.");
      setIsFollowingUser(true); // Re-enable follow
    } else {
      setDestinationLocation(null);
      setAiResponseText("Destination cleared.");
    }
  };

  const handleStartTrip = () => {
    if (userLocation && destinationLocation) {
      setIsNavigating(true);
      setIsFollowingUser(true); // Auto-follow on start
      setAiResponseText("Navigation started! Follow the route on the map.");
      // Center on user location for navigation
      setMapCenter(userLocation);
      setMapZoom(16);
    } else {
      setAiResponseText("Please set both start and destination locations.");
    }
  };

  const handleRouteFound = (route: RouteData, start: Coordinates, end: Coordinates) => {
    setRouteData(route);
    setManualLocation(start);
    setDestinationLocation(end);
    setAiResponseText(`Route found! ${Math.round(route.distance / 1000)}km, ${Math.round(route.duration / 60)} mins.`);
  };

  const handleMapChange = (center: Coordinates, zoom: number) => {
    setMapCenter(center);
    setMapZoom(zoom);
    // If user manually moves map, stop following (unless just zoom change? keeping simple for now)
    // We can check if the move was initiated by user interaction in Map component, but here we assume any change not from us is user
    // Actually, Map component only calls onMapChange on moveend/zoomend.
    // Ideally we want to know if it was a user interaction.
    // For now, let's NOT disable on simple updates, but maybe we can rely on the user clicking "My Location" to re-center.
    // BUT, common UX is: drag map -> stop following.
    // We'll implement that in Map.tsx via dragstart event or similar, or just let the user toggle it.
    // Let's stick to explicit toggle for now to avoid fighting, or disable if distance is large.

    // Better UX: If isFollowingUser is true, and we detect a drag, we set it to false.
    // We need to pass a "isUserInteraction" flag from Map, or just handle it there.
    // For now, let's leave this simple and rely on the button to re-engage.
    // Actually, if we don't set it to false here, the next GPS update will snap it back, which is annoying if they are trying to look around.
    // So we SHOULD set it to false if the map moves significantly away from user location?
    // Let's handle this in Map.tsx events.
  };

  const handleMapDrag = () => {
    if (isFollowingUser) {
      setIsFollowingUser(false);
      // setAiResponseText("Map moved. Stopped following."); // Optional feedback
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const userQuery = query.trim();
    // Don't clear query immediately so user sees what they searched
    inputRef.current?.blur(); // Hide keyboard on mobile
    setAppState(AppState.LOADING);
    setAiResponseText(null);
    setSelectedPlaceId(null);
    setErrorText(null);
    setIsFollowingUser(false); // Stop following to show results

    try {
      // Call Gemini API
      const locationForSearch = userLocation ? {
        latitude: userLocation.lat,
        longitude: userLocation.lng
      } : undefined;

      const response = await sendMessageToGemini(userQuery, locationForSearch);

      // Update UI with results
      setAiResponseText(response.text || "Here is what I found.");

      if (response.places && response.places.length > 0) {
        setPlaces(response.places);

        // Center on the first place
        const firstPlace = response.places[0];
        if (firstPlace.coordinates && !isNaN(firstPlace.coordinates.lat)) {
          setMapCenter(firstPlace.coordinates);
          setMapZoom(14);
        }
      } else {
        if (response.places) setPlaces(response.places);
      }

      setAppState(AppState.RESULTS);
    } catch (error) {
      setAppState(AppState.ERROR);
      setAiResponseText("I encountered an error. Please try again.");
    }
  };

  const handlePlaceSelect = (placeId: string) => {
    setSelectedPlaceId(placeId);
    setIsFollowingUser(false); // Stop following to look at place
    const place = places.find(p => p.id === placeId);
    if (place && place.coordinates && !isNaN(place.coordinates.lat)) {
      setMapCenter(place.coordinates);
      setMapZoom(16);

      // Scroll the card into view in the bottom carousel
      const cardElement = document.getElementById(`card-${placeId}`);
      if (cardElement && carouselRef.current) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  return (
    <div className="fixed inset-0 w-full bg-slate-950 overflow-hidden text-slate-100 font-sans">

      {/* BACKGROUND MAP LAYER */}
      <div className="absolute inset-0 z-0">
        <MapComponent
          center={mapCenter}
          zoom={mapZoom}
          places={places}
          selectedPlaceId={selectedPlaceId}
          onPlaceSelect={handlePlaceSelect}
          userLocation={userLocation}
          destinationLocation={destinationLocation}
          onLocate={handleManualLocate}
          isLocating={isLocating}
          isNavigating={isNavigating}
          onMapChange={handleMapChange}
          routeData={routeData}
          onMapClick={(coords) => {
            setDestinationLocation(coords);
            setIsRoutePlannerOpen(true);
            setAiResponseText("Destination pinned! Click 'Start Journey' to route.");
            setIsFollowingUser(false); // Stop following to pin
          }}
          isFollowingUser={isFollowingUser}
          onUserInteraction={handleMapDrag}
        />
      </div>



      {/* ROUTE PLANNER */}
      {isRoutePlannerOpen && (
        <RoutePlanner
          userLocation={userLocation}
          onRouteFound={handleRouteFound}
          onCancel={() => {
            setIsRoutePlannerOpen(false);
            setRouteData(null);
            setDestinationLocation(null);
          }}
        />
      )}

      {/* TOP FLOATING SEARCH BAR */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 pt-6 md:pt-8 pointer-events-none flex flex-col items-center">
        <div className="w-full max-w-lg pointer-events-auto relative group flex gap-2">
          {/* Neon Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 blur-lg transition duration-500"></div>

          <form
            onSubmit={handleSearch}
            className="flex-1 relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl flex items-center p-1.5 transition-all focus-within:bg-slate-900/95 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/30"
          >
            <div className="pl-3 pr-2 text-cyan-400">
              {appState === AppState.LOADING ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events, cafes, vibes..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-slate-400 h-10 px-1"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                title="Clear search"
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              title="Search"
              disabled={appState === AppState.LOADING || !query.trim()}
              className="ml-1 bg-cyan-600 hover:bg-cyan-500 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Route Planner Toggle Button */}
          <button
            onClick={() => setIsRoutePlannerOpen(!isRoutePlannerOpen)}
            className={`relative bg-slate-900/80 backdrop-blur-xl border ${isRoutePlannerOpen ? 'border-cyan-500 text-cyan-400' : 'border-slate-700/50 text-slate-400'} hover:text-white hover:border-cyan-500/50 rounded-2xl shadow-2xl p-3 transition-all`}
            title="Route Planner"
          >
            <Navigation className="w-6 h-6" />
          </button>
        </div>

        {/* AI SUMMARY TOAST */}
        {aiResponseText && (
          <div className="mt-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-500 max-w-lg w-full">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-xl p-3 shadow-xl flex items-start gap-3">
              <div className="bg-cyan-950/50 p-1.5 rounded-lg border border-cyan-900/50 mt-0.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all cursor-default">
                  {aiResponseText}
                </p>
              </div>
              <button
                onClick={() => setAiResponseText(null)}
                title="Dismiss"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM RESULTS CAROUSEL */}
      {places.length > 0 && !isRoutePlannerOpen && (
        <div className="absolute bottom-6 left-0 right-0 z-30 pointer-events-none">
          <div
            ref={carouselRef}
            className="flex overflow-x-auto px-4 md:px-8 pb-4 gap-4 pointer-events-auto snap-x snap-mandatory scrollbar-none scroll-smooth"
          >
            {places.map((place) => (
              <div
                key={place.id}
                id={`card-${place.id}`}
                className="snap-center flex-shrink-0 first:pl-2 last:pr-2"
              >
                <PlaceCard
                  place={place}
                  isSelected={selectedPlaceId === place.id}
                  onClick={() => handlePlaceSelect(place.id)}
                  compact
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BRANDING */}
      <div className="absolute top-4 left-4 z-10 hidden md:flex items-center gap-2 opacity-50 pointer-events-none">
        <Compass className="w-5 h-5 text-cyan-500" />
        <span className="font-bold text-sm tracking-widest text-white/50">NEON<span className="text-cyan-500">MAPS</span></span>
      </div>

    </div>
  );
};

export default App;
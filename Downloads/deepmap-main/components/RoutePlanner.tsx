import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search, X, Clock, Ruler, ArrowRight } from 'lucide-react';
import { Coordinates, RouteData } from '../types';

interface RoutePlannerProps {
    userLocation: Coordinates | null;
    destinationLocation?: Coordinates | null;
    onRouteFound: (route: RouteData, start: Coordinates, end: Coordinates) => void;
    onCancel: () => void;
}

interface Suggestion {
    display_name: string;
    lat: string;
    lon: string;
}

export const RoutePlanner: React.FC<RoutePlannerProps> = ({ userLocation, destinationLocation, onRouteFound, onCancel }) => {
    const [startQuery, setStartQuery] = useState('');
    const [destQuery, setDestQuery] = useState('');
    const [startCoords, setStartCoords] = useState<Coordinates | null>(userLocation);
    const [destCoords, setDestCoords] = useState<Coordinates | null>(destinationLocation || null);

    const [startSuggestions, setStartSuggestions] = useState<Suggestion[]>([]);
    const [destSuggestions, setDestSuggestions] = useState<Suggestion[]>([]);

    const [isLoading, setIsLoading] = useState(false);
    const [routeStats, setRouteStats] = useState<{ distance: number; duration: number } | null>(null);

    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Initialize start query if user location is available
    useEffect(() => {
        if (userLocation && !startQuery) {
            setStartCoords(userLocation);
            setStartQuery("Current Location");
        }
    }, [userLocation]);

    // Sync destination from props (e.g. map click)
    useEffect(() => {
        if (destinationLocation) {
            setDestCoords(destinationLocation);
            setDestQuery("Pinned Location");
        }
    }, [destinationLocation]);

    const fetchSuggestions = async (query: string, type: 'start' | 'dest') => {
        if (!query || query.length < 3) {
            if (type === 'start') setStartSuggestions([]);
            else setDestSuggestions([]);
            return;
        }

        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (type === 'start') setStartSuggestions(data);
            else setDestSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: 'start' | 'dest') => {
        const val = e.target.value;
        if (type === 'start') {
            setStartQuery(val);
            setStartCoords(null); // Reset coords on edit
        } else {
            setDestQuery(val);
            setDestCoords(null);
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => fetchSuggestions(val, type), 500);
    };

    const handleSelect = (suggestion: Suggestion, type: 'start' | 'dest') => {
        const coords = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
        if (type === 'start') {
            setStartQuery(suggestion.display_name);
            setStartCoords(coords);
            setStartSuggestions([]);
        } else {
            setDestQuery(suggestion.display_name);
            setDestCoords(coords);
            setDestSuggestions([]);
        }
    };

    const handleStartJourney = async () => {
        if (!startCoords || !destCoords) return;

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${destCoords.lng},${destCoords.lat}?overview=full&geometries=geojson`
            );
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0];
                const coordinates = route.geometry.coordinates.map((coord: [number, number]) => [coord[1], coord[0]]); // Flip to [lat, lng]

                const routeData: RouteData = {
                    coordinates,
                    distance: route.distance,
                    duration: route.duration
                };

                setRouteStats({ distance: route.distance, duration: route.duration });
                onRouteFound(routeData, startCoords, destCoords);
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            alert("Failed to find route. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatDistance = (meters: number) => {
        if (meters < 1000) return `${Math.round(meters)} m`;
        return `${(meters / 1000).toFixed(1)} km`;
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.round(seconds / 60);
        if (mins < 60) return `${mins} mins`;
        const hrs = Math.floor(mins / 60);
        const remainingMins = mins % 60;
        return `${hrs} hr ${remainingMins} mins`;
    };

    return (
        <div className="absolute top-20 left-4 z-[400] w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden font-sans">

            {/* Header */}
            <div className="p-4 border-b border-slate-700/50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-cyan-400" />
                    Route Planner
                </h2>
                <button onClick={onCancel} className="text-slate-400 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="p-4 space-y-4">
                {/* Start Input */}
                <div className="relative">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></div>
                        <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">Start</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={startQuery}
                            onChange={(e) => handleInput(e, 'start')}
                            placeholder="Enter Current Location"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                        />
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        {startSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50">
                                {startSuggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleSelect(s, 'start')}
                                        className="px-4 py-2.5 hover:bg-slate-700 cursor-pointer text-sm text-slate-200 border-b border-slate-700/50 last:border-none"
                                    >
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Connector Line */}
                <div className="absolute left-[21px] top-[100px] w-0.5 h-8 bg-gradient-to-b from-cyan-400/50 to-pink-500/50"></div>

                {/* Destination Input */}
                <div className="relative">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_10px_#ec4899]"></div>
                        <span className="text-xs font-medium text-pink-500 uppercase tracking-wider">Destination</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            value={destQuery}
                            onChange={(e) => handleInput(e, 'dest')}
                            placeholder="Enter Destination"
                            className="w-full bg-slate-800/50 border border-slate-600 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/50 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        {destSuggestions.length > 0 && (
                            <ul className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-xl shadow-xl max-h-48 overflow-y-auto z-50">
                                {destSuggestions.map((s, i) => (
                                    <li
                                        key={i}
                                        onClick={() => handleSelect(s, 'dest')}
                                        className="px-4 py-2.5 hover:bg-slate-700 cursor-pointer text-sm text-slate-200 border-b border-slate-700/50 last:border-none"
                                    >
                                        {s.display_name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleStartJourney}
                    disabled={!startCoords || !destCoords || isLoading}
                    className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-cyan-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>Loading Route...</>
                    ) : (
                        <>
                            Start Journey <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>

                {/* Stats Panel */}
                {routeStats && (
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg">
                                <Ruler className="w-5 h-5 text-cyan-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Total Distance</p>
                                <p className="text-lg font-bold text-white">{formatDistance(routeStats.distance)}</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-700"></div>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-700 rounded-lg">
                                <Clock className="w-5 h-5 text-pink-400" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Est. Time</p>
                                <p className="text-lg font-bold text-white">{formatDuration(routeStats.duration)}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

import React from 'react';
import { Place } from '../types';
import { MapPin, Navigation, Star } from 'lucide-react';

interface PlaceCardProps {
  place: Place;
  isSelected?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({ place, isSelected, onClick, compact }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer group
        ${compact ? 'w-[300px] md:w-[340px] bg-slate-900/90 backdrop-blur-xl' : 'w-full bg-slate-800/50'}
        ${isSelected 
          ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50' 
          : 'border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/90'
        }
      `}
    >
      {/* Card Content */}
      <div className="flex p-3 gap-3">
        {/* Image / Icon */}
        <div className="relative flex-shrink-0 w-20 h-20 bg-slate-800 rounded-xl overflow-hidden border border-slate-700/50">
          <img 
            src={`https://picsum.photos/seed/${place.id}/150/150`} 
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />
          {/* Category Icon Overlay (Fake for now) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-bold truncate text-base leading-tight ${isSelected ? 'text-cyan-400' : 'text-slate-100'}`}>
              {place.name}
            </h3>
            {isSelected && <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse mt-1.5" />}
          </div>
          
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 truncate">
            <MapPin size={12} className="text-slate-500 flex-shrink-0" />
            <span className="truncate">{place.address || "Location detail"}</span>
          </p>
          
          <div className="mt-2.5 flex items-center justify-between">
            <div className="flex items-center gap-0.5 text-amber-400">
               <Star size={10} fill="currentColor" />
               <Star size={10} fill="currentColor" />
               <Star size={10} fill="currentColor" />
               <Star size={10} fill="currentColor" />
               <span className="text-[10px] text-slate-500 ml-1 font-medium">(4.2)</span>
            </div>

            <button className={`
               text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 transition-colors
               ${isSelected 
                 ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30' 
                 : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-slate-500 group-hover:text-slate-200'
               }
            `}>
              <Navigation size={10} />
              Fly To
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
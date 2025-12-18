export interface Coordinates {
  lat: number;
  lng: number;
  accuracy?: number; // Accuracy in meters
}

export interface Place {
  id: string;
  name: string;
  coordinates: Coordinates;
  address?: string;
  description?: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        text: string;
      }[];
    };
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  places?: Place[];
  groundingChunks?: GroundingChunk[];
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface RouteData {
  coordinates: [number, number][]; // Array of [lat, lng] for Polyline
  distance: number; // in meters
  duration: number; // in seconds
}
// src/types/content.ts

export type Event = {
    id: string;
    title: string;
    date: string;
    description: string;
    location: string;
    imageUrl: string;
    ieeeCount?: number;
    nonIeeeCount?: number;
  };
  export type Award = {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    imageUrl: string;
    winners: string; // Could be a list or comma-separated string based on your data structure
    location: string;
  };
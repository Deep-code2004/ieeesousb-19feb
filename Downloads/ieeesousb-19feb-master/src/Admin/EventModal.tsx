import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ImageUrlInput from "./ImageUrlInput";

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event?: any; // Optional event for editing
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, event, setSuccess, setError }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventTime, setEventTime] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");
  const [eventSpeakers, setEventSpeakers] = useState<string>("");
  const [eventImage, setEventImage] = useState<string>("");

  // Initialize form with event data if editing
  useEffect(() => {
    if (event) {
      setEventName(event.name || "");
      setEventDate(event.date || "");
      setEventTime(event.time || "");
      setEventDescription(event.description || "");
      setEventSpeakers(event.speakers || "");
      setEventImage(event.image || "");
    } else {
      resetEventForm();
    }
  }, [event]);

  // Reset form states
  const resetEventForm = () => {
    setEventName("");
    setEventDate("");
    setEventTime("");
    setEventDescription("");
    setEventSpeakers("");
    setEventImage("");
  };

  // Handle form submissions (Add or Update event)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const eventData = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        speakers: eventSpeakers,
        image: eventImage,
        ...(event ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
      };

      if (event?.id) {
        // Update existing event
        await updateDoc(doc(db, "events", event.id), eventData);
        setSuccess("Event updated successfully!");
      } else {
        // Add new event
        await addDoc(collection(db, "events"), eventData);
        setSuccess("Event added successfully!");
      }
      
      resetEventForm();
      onClose();
    } catch (err: any) {
      setError(`Error ${event ? 'updating' : 'adding'} event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{event ? 'Edit' : 'Add New'} Event</h3>
            <button 
              className="text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Event Name */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Event Name</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Annual Tech Conference"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            
            {/* Event Date and Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date</label>
                <input
                  type="date"
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Time</label>
                <input
                  type="time"
                  className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Event Image URL */}
            <ImageUrlInput 
              value={eventImage}
              onChange={setEventImage}
              label="Event Image URL"
              placeholder="https://example.com/event-image.jpg"
            />
            
            {/* Event Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Description</label>
              <textarea
                className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                placeholder="Event description..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                required
              ></textarea>
            </div>
            
            {/* Event Speakers */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Speakers</label>
              <input
                type="text"
                className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dr. Jane Smith, Prof. John Doe"
                value={eventSpeakers}
                onChange={(e) => setEventSpeakers(e.target.value)}
                required
              />
              <p className="text-gray-500 text-sm mt-1">Separate multiple speakers with commas</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Saving..." : (event ? "Update Event" : "Save Event")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

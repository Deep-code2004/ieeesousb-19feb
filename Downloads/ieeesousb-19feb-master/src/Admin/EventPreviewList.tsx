import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
  where
} from "firebase/firestore";

interface EventPreviewListProps {
  onEdit: (event: any) => void;
  onDelete: (id: string) => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

const EventPreviewList: React.FC<EventPreviewListProps> = ({
  onEdit,
  onDelete,
  setSuccess,
  setError
}) => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [eventsPerPage] = useState<number>(8);
  const [viewMode, setViewMode] = useState<string>("all"); // "all", "upcoming", "past"

  // Use Firestore real-time updates
  useEffect(() => {
    setLoading(true);
    try {
      const eventsQuery = query(
        collection(db, "events"),
        orderBy("createdAt", "desc")
      );
      
      // Set up real-time listener
      const unsubscribe = onSnapshot(
        eventsQuery,
        (querySnapshot) => {
          const eventsList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEvents(eventsList);
          setLoading(false);
          console.log("Fetched events:", eventsList.length);
          // Debug the first event to check field names
          if (eventsList.length > 0) {
            console.log("First event data:", eventsList[0]);
          }
        },
        (err) => {
          setError(`Error fetching events: ${err.message}`);
          console.error("Events fetch error:", err);
          setLoading(false);
        }
      );
      
      // Clean up the listener when component unmounts
      return () => unsubscribe();
    } catch (err: any) {
      setError(`Error setting up events listener: ${err.message}`);
      console.error("Events listener error:", err);
      setLoading(false);
    }
  }, [setError]);

  const handleDelete = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setSuccess("Event deleted successfully!");
      setConfirmDelete(null);
    } catch (err: any) {
      setError(`Error deleting event: ${err.message}`);
    }
  };

  const handleEdit = (event: any) => {
    onEdit(event);
  };

  // Get event name (handles both name and title fields)
  const getEventName = (event: any) => {
    return event.name || event.title || "Unnamed Event";
  };

  // Filter events based on view mode and search query
  const filteredEvents = events.filter((event) => {
    // First apply view mode filter
    if (viewMode === "upcoming" && !event.isUpcoming) {
      return false;
    }
    if (viewMode === "past" && event.isUpcoming) {
      return false;
    }
    
    // Then apply search query filter
    return (
      getEventName(event).toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.speakers?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.date?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Pagination
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date if needed
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    // Check if date is already formatted or needs formatting
    if (dateString.includes("-")) {
      try {
        const [year, month, day] = dateString.split('-');
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (e) {
        return dateString;
      }
    }
    return dateString;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filter and Search Bar */}
      <div className="p-3 sm:p-4 border-b">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4">
          <div className="flex flex-wrap gap-2 mb-3 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
            <button
              onClick={() => setViewMode("all")}
              className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                viewMode === "all"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setViewMode("upcoming")}
              className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                viewMode === "upcoming"
                  ? "bg-green-100 text-green-700 font-medium"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setViewMode("past")}
              className={`px-2 py-1 text-xs sm:text-sm rounded-md ${
                viewMode === "past"
                  ? "bg-gray-200 text-gray-700 font-medium"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Regular
            </button>
          </div>
          
          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search Events"
              className="w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-gray-300 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center p-4 sm:p-8">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Events Found */}
      {!loading && filteredEvents.length === 0 && (
        <div className="p-4 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
          {viewMode !== "all" 
            ? `No ${viewMode} events found. Change the filter or add new events.` 
            : "No events found. Add a new event to get started."}
        </div>
      )}

      {/* Event Cards */}
      {!loading && currentEvents.length > 0 && (
        <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                {event.isUpcoming && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-0.5 text-xs font-medium z-10">
                    Upcoming
                  </div>
                )}
                {event.image ? (
                  <img
                    src={event.image}
                    alt={getEventName(event)}
                    className="object-cover w-full h-40 sm:h-48 md:h-56 lg:h-64"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm5 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1zm0 4a1 1 0 100 2h4a1 1 0 100-2h-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1">
                  {getEventName(event)}
                </h3>
                {event.date && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    <span className="font-medium">Date:</span> {formatDate(event.date)}
                  </p>
                )}
                {event.time && (
                  <p className="text-xs sm:text-sm text-gray-500">
                    <span className="font-medium">Time:</span> {event.time}
                  </p>
                )}
                {event.venue && (
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    <span className="font-medium">Venue:</span> {event.venue}
                  </p>
                )}
                {event.speakers && (
                  <p className="text-xs sm:text-sm text-gray-500 truncate">
                    <span className="font-medium">Speakers:</span> {event.speakers}
                  </p>
                )}
                {event.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 sm:line-clamp-3">
                    {event.description}
                  </p>
                )}

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {confirmDelete === event.id ? (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Confirm Delete"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                        title="Cancel"
                      >
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(event.id)}
                      className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredEvents.length > eventsPerPage && (
        <div className="flex justify-center items-center space-x-2 sm:space-x-4 py-3 sm:py-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <div className="flex items-center px-2 sm:px-4">
            <span className="text-xs sm:text-sm text-gray-600">
              {currentPage} / {Math.ceil(filteredEvents.length / eventsPerPage)}
            </span>
          </div>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * eventsPerPage >= filteredEvents.length}
            className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
      
      {/* Event count */}
      {!loading && filteredEvents.length > 0 && (
        <div className="px-3 sm:px-6 py-2 sm:py-3 bg-gray-50 border-t text-xs sm:text-sm text-gray-500">
          Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
          {viewMode !== 'all' ? ` (${viewMode})` : ''}
        </div>
      )}
    </div>
  );
};

export default EventPreviewList;
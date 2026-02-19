import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface FirestoreEvent {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  image: string;
  speakers: string;
}

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [events, setEvents] = useState<FirestoreEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsRef = collection(db, "events");
      const snapshot = await getDocs(eventsRef);

      const data: FirestoreEvent[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreEvent[];

      // Sort by event.date descending (latest first)
      const sortedByDate = data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setEvents(sortedByDate);
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our upcoming and past events, workshops, and conferences designed to enhance your technical knowledge and professional network.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{filteredEvents.length}</span> events
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="glass rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                     <div className="h-52 overflow-hidden bg-muted/30 flex items-center justify-center">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{event.description}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Speakers:</span> {event.speakers}
                  </p>
                  <Button size="sm" asChild>
                    <Link to={`/eventdetails/${event.id}`}>Read More</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase"; // Adjust path if needed
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom"; // ✅ Import Link for routing

interface FirestoreAward {
  id: string;
  year: string;
  type: "student" | "branch"; // Only two types
  title: string;
  image: string;
  description: string;
}

export default function Awards() {
  const [searchTerm, setSearchTerm] = useState("");
  const [awards, setAwards] = useState<FirestoreAward[]>([]);

  useEffect(() => {
    const fetchAwards = async () => {
      const awardsRef = collection(db, "awards");
      const q = query(awardsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data: FirestoreAward[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as FirestoreAward[];
      setAwards(data);
    };

    fetchAwards();
  }, []);

  const filteredAwards = awards.filter((award) =>
    award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    award.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Awards</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the prestigious awards won by our students and branches, recognizing excellence in various fields.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search awards..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold">{filteredAwards.length}</span> awards
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAwards.map((award) => (
              <div
                key={award.id}
                className="glass rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-52 overflow-hidden bg-muted/30 flex items-center justify-center">
                  <img
                    src={award.image}
                    alt={award.title}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-2 line-clamp-1">{award.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {award.year} • {award.type === "student" ? "Student" : "Branch"}
                  </p>
                  <p className="text-sm mb-4 line-clamp-2">{award.description}</p>
                  <Button size="sm" asChild>
                    {/* ✅ Read More Link with award ID */}
                    <Link to={`/awarddetails/${award.id}`}>Read More</Link>
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

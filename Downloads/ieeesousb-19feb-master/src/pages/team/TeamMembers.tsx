import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/firebase"; // Import Firebase configuration
import { collection, query, where, getDocs } from "firebase/firestore";

const ITEMS_PER_PAGE = 20;

export default function TeamMembers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMembers = async () => {
      const q = query(collection(db, "members"), where("type", "==", "member"));
      const querySnapshot = await getDocs(q);
      const membersData: any[] = [];
      querySnapshot.forEach((doc) => {
        membersData.push(doc.data());
      });
      setMembers(membersData);
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const results = members.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFiltered(results);
    setPage(1);
  }, [searchTerm, members]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Student Members</h1>
            <p className="text-muted-foreground">Explore all IEEE SOU student members</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search members..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Card layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentItems.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-4">
                <div className="flex flex-col items-center">
                  <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover mb-4" />
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block mb-2 text-primary hover:text-primary/80">
                      <Linkedin className="h-4 w-4 inline" />
                    </a>
                    <p className="text-sm text-muted-foreground">{member.designation}</p>
                    <p className="text-sm mt-1">{member.education}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded-md ${page === i + 1 ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Search, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Define the committee titles that we expect to find in the database
const COMMITTEE_TITLES = [
  "Technical Committee",
  "Content Committee",
  "Curation Committee",
  "Creative Committee",
  "Outreach Committee",
  "Management Committee",
];

// Define position priority
const POSITION_PRIORITY: Record<string, number> = {
  "chairperson": 1,
  "vice chairperson": 2,
  "interim chairperson": 3,
  "interim vice chairperson": 4,
};

// Using a consistent hover effect for all members
const HOVER_EFFECT = "hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] transition-transform";

export default function TeamCore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [coreMembers, setCoreMembers] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function fetchCoreMembers() {
      const membersRef = collection(db, "members");
      const q = query(membersRef, where("type", "==", "core"));
      const querySnapshot = await getDocs(q);

      const grouped: Record<string, any[]> = {};
      COMMITTEE_TITLES.forEach((committee) => {
        grouped[committee] = [];
      });

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const committee = data.committee;

        if (COMMITTEE_TITLES.includes(committee)) {
          grouped[committee].push({ ...data, id: doc.id });
        }
      });

      setCoreMembers(grouped);
    }

    fetchCoreMembers();
  }, []);

  const normalize = (pos: string) =>
    pos?.toLowerCase().replace(/-/g, " ").trim();

  const sortMembers = (members: any[]) => {
    return [...members].sort((a, b) => {
      const posA = POSITION_PRIORITY[normalize(a.position)] || 99;
      const posB = POSITION_PRIORITY[normalize(b.position)] || 99;
      return posA - posB;
    });
  };

  const filterMembers = (members: any[]) =>
    sortMembers(
      members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.designation &&
            member.designation.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    );

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F172A]">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 animate-fade-in bg-white dark:bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
              Core Committee
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto dark:text-muted-foreground-dark">
              Meet the core team members of each IEEE committee.
            </p>
          </div>

          {/* Search Input */}
          <div className="flex justify-center mb-12">
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

          {/* Display committees */}
          {COMMITTEE_TITLES.map((committee) => {
            const members = filterMembers(coreMembers[committee] || []);
            if (members.length === 0) return null;

            return (
              <div key={committee} className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-primary dark:text-primary-dark">
                  {committee}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={`rounded-lg overflow-hidden shadow-sm transition-all duration-300
                        bg-white dark:bg-gray-900
                        ${HOVER_EFFECT}
                        hover:shadow-md dark:hover:shadow-lg cursor-pointer`}
                    >
                      <div className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="w-16 h-16 min-w-16 rounded-full overflow-hidden mr-4">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            {/* Name and LinkedIn */}
                            <div className="flex items-center mb-1">
                              <h3 className="font-bold text-lg text-black dark:text-white">{member.name}</h3>
                              {member.linkedin && (
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-primary hover:text-primary/80 dark:text-primary-dark dark:hover:text-primary-dark/80"
                                >
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              )}
                            </div>

                            {/* Position */}
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">{member.position}</p>

                            {/* Education */}
                            {member.education && (
                              <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                                {member.education}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

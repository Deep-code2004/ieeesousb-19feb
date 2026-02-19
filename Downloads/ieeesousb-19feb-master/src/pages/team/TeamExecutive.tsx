import { useState, useEffect } from "react";
import { Search, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const SOCIETY_TITLES = {
  SB: "Student Branch",
  WIE: "Women in Engineering",
  SPS: "Signal Processing Society",
  CS: "Computer Society",
  SIGHT: "Special Interest Group on Humanitarian Technology",
};

const POSITION_HIERARCHY = [
  "Chairperson",
  "Vice-Chairperson",
  "Secretary",
  "Treasurer",
  "Webmaster",
];

// Using a consistent hover effect for all members instead of different colors
const HOVER_EFFECT = "hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-[1.02] transition-transform";

export default function TeamExecutive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [executiveMembers, setExecutiveMembers] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function fetchExecutiveMembers() {
      const membersRef = collection(db, "members");
      const q = query(membersRef, where("type", "==", "executive"));
      const querySnapshot = await getDocs(q);

      const grouped: Record<string, any[]> = {
        SB: [],
        WIE: [],
        SPS: [],
        CS: [],
        SIGHT: [],
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const societyType = data.society;

        let standardizedPosition = data.position;
        if (standardizedPosition.toLowerCase() === "vice chairperson") {
          standardizedPosition = "Vice-Chairperson";
        }

        if (grouped[societyType]) {
          grouped[societyType].push({ ...data, position: standardizedPosition, id: doc.id });
        }
      });

      setExecutiveMembers(grouped);
    }

    fetchExecutiveMembers();
  }, []);

  const filterMembers = (members: any[]) =>
    members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortMembersByPosition = (members: any[]) => {
    return members.sort((a, b) => {
      const positionOrder: Record<string, number> = {
        Chairperson: 1,
        "Vice-Chairperson": 2,
        Secretary: 3,
        Treasurer: 4,
        Webmaster: 5,
      };

      const aPosIndex = positionOrder[a.position] ?? 999;
      const bPosIndex = positionOrder[b.position] ?? 999;

      return aPosIndex - bPosIndex;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0F172A]">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 animate-fade-in bg-white dark:bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white">
              Executive Team
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto dark:text-muted-foreground-dark">
              Meet the executive members of each IEEE society.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search executive..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {Object.entries(SOCIETY_TITLES).map(([societyKey, title]) => {
            const members = filterMembers(executiveMembers[societyKey] || []);
            if (members.length === 0) return null;

            const sortedMembers = sortMembersByPosition(members);

            return (
              <div key={societyKey} className="mb-16">
                <div className="text-2xl font-semibold mb-6 text-primary dark:text-primary-dark">
                  {title}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedMembers.map((member) => (
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
                            <div className="flex items-center">
                              <h3 className="font-bold text-lg text-black dark:text-white">
                                {member.name}
                              </h3>
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
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                              {member.position}
                            </p>
                            <p className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                              {member.education}
                            </p>
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

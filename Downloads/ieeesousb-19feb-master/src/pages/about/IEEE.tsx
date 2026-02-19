import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function IEEE() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              IEEE
            </h1>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-8 animate-fade-in-up animation-delay-300" />
          </div>

          {/* Content Section */}
          <div className="prose dark:prose-invert max-w-none animate-fade-in-up animation-delay-500">
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">IEEE History</h2>

              <p className="mb-4">
                The Institute of Electrical and Electronics Engineers (IEEE) was formed in 1963 through
                the merger of the American Institute of Electrical Engineers (AIEE), founded in 1884, and
                the Institute of Radio Engineers (IRE), founded in 1912. As the world's largest technical
                professional society, IEEE is dedicated to advancing innovation and technological excellence
                for the benefit of humanity.
              </p>

              <p className="mb-4">
                With a global presence, IEEE has more than 423,000 members across 160+ countries, including
                over 117,000 student members. It operates through 342 sections in 10 geographic regions worldwide
                and facilitates collaboration through 2,562 chapters and 3,485 student branches across more than
                100 countries. Additionally, 2,877 student branch chapters of IEEE technical societies and 580
                affinity groups (including IEEE-USA Consultants' Network, Young Professionals, Women in Engineering,
                Life Members, and IEEE Entrepreneurship) provide support for diverse professional communities.
              </p>

              <p className="mb-4">
                A key leader in global standards development, IEEE has played a crucial role in shaping modern
                communication networks through its IEEE 802 standards, including Ethernet and Wireless LAN (Wi-Fi).
                It also serves as a major hub for research and knowledge dissemination, publishing over 200 transactions,
                journals, and magazines while sponsoring more than 1,800 conferences in 96 countries annually.
              </p>

              <p>
                With its continued commitment to technological progress, IEEE remains at the forefront of electrical,
                electronic, and computing advancements, driving innovation and shaping the future of modern civilization.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

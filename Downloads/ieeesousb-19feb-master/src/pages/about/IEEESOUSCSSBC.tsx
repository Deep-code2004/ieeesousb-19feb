import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function IEEESOUSCSSBC() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="mb-12 text-center">
            <img
              src="http://ieee.socet.edu.in/wp-content/uploads/2025/12/IEEE-Computer-Society-SBC.png"
              alt="IEEE SOU CS SBC Logo"
              className="h-32 md:h-48 mx-auto mb-6 object-contain animate-fade-in-up"
            />
            <h1 className="sr-only">IEEE SOU CS SBC</h1>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-8 animate-fade-in-up animation-delay-300" />
          </div>

          {/* Content Section */}
          <div className="prose dark:prose-invert max-w-none">
            {/* Vision Section */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-500">
              <h2 className="text-2xl font-semibold mb-6">Vision</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To become a center of excellence in computer science and engineering education.</li>
                <li>Raising innovative minds to create a highly skilled workforce in the tech industry.</li>
                <li>To drive technological advancements in the field of computer science.</li>
              </ul>
            </section>

            {/* Mission Section */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-700">
              <h2 className="text-2xl font-semibold mb-6">Mission</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To promote education, research, and practical applications in computer science and technology.</li>
                <li>To bridge the gap between academia and industry by providing students with hands-on experience.</li>
                <li>To collaborate with industry and academic institutions to create a knowledge-sharing environment.</li>
                <li>To equip students with critical skills in computer science, enabling them to become tech leaders.</li>
                <li>To foster a community where students, faculty, and professionals can explore and innovate.</li>
              </ul>
              <p className="mt-4">
                The CS SBC aims to provide a platform for students to collaborate, share knowledge, and advance their technical and professional skills. Through workshops, seminars, and technical events, we help students stay up-to-date with the latest developments in the field.
              </p>
            </section>

            {/* About Section */}
            <section className="bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-900">
              <h2 className="text-2xl font-semibold mb-6">About IEEE SOU CS SBC</h2>
              <p className="mb-4">
                IEEE SOU CS SBC is dedicated to cultivating a vibrant community that connects students, professionals, and academics in the field of computer science. The society has seen rapid growth, attracting a large membership base. Our mission is to create a platform for students to enhance their technical and professional skills and collaborate with others in the field.
              </p>

              <p>
                Since its inception, IEEE SOU CS SBC has organized numerous workshops, seminars, and technical events that have empowered students to stay ahead of the curve in the ever-evolving tech landscape. By fostering a collaborative environment, we aim to prepare students for success in the tech industry.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

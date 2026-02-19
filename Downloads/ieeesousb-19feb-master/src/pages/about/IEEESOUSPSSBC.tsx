import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function IEEESOUSPSSBC() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Heading */}
          <div className="mb-12 text-center">
            <img
              src="http://ieee.socet.edu.in/wp-content/uploads/2025/12/IEEE-SPS-SOU-SBC-Full-Color.png"
              alt="IEEE SOU SPS Logo"
              className="h-32 md:h-48 mx-auto mb-6 object-contain animate-fade-in-up"
            />
            <h1 className="sr-only">IEEE SOU SPS SBC</h1>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-8 animate-fade-in-up animation-delay-300" />
          </div>

          {/* Content Section */}
          <div className="prose dark:prose-invert max-w-none">
            {/* Vision Section */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-500">
              <h2 className="text-2xl font-semibold mb-6">Vision</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Being a one-stop source of signal processing resources.</li>
                <li>Providing a variety of high-quality resources customized to users' interests.</li>
                <li>Adapting to a rapidly changing technical community.</li>
              </ul>
            </section>

            {/* Mission Section */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-700">
              <h2 className="text-2xl font-semibold mb-6">Mission</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Advancing and disseminating state-of-the-art scientific information.</li>
                <li>Providing a venue for people to interact and exchange ideas.</li>
                <li>Enabling collaboration among professionals, students, and academics in signal processing.</li>
              </ul>
              <p className="mt-4">
                Our mission is to enable technology for the generation, transformation, and interpretation of information in the signal processing domain.
              </p>
            </section>

            {/* About Section */}
            <section className="bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-900">
              <h2 className="text-2xl font-semibold mb-6">About IEEE SOU SPS SBC</h2>
              <p className="mb-4">
                The Signal Processing Society, founded in 1948, is the first IEEE society with a focus on advancing and spreading scientific information in signal processing.
              </p>

              <p>
                IEEE SOU SPS SBC was established in 2021. Despite the short time, we have become the largest society in the Gujarat Section with 63 members. We've organized specialized symposia on emerging technologies and worked hard to keep our members up to date with the latest in signal processing.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

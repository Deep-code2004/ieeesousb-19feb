import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function IEEESOUSSIGHTSBG() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
              IEEE SOU SIGHT SBG
            </h1>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-8 animate-fade-in-up animation-delay-300" />
          </div>

          {/* Sections */}
          <div className="prose dark:prose-invert max-w-none">
            {/* Vision */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-500">
              <h2 className="text-2xl font-semibold mb-6">Vision</h2>
              <p>
                To leverage technology for humanitarian causes and create lasting, impactful change in underserved communities by improving access to basic resources, education, and healthcare.
              </p>
            </section>

            {/* Mission */}
            <section className="mb-12 bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-700">
              <h2 className="text-2xl font-semibold mb-6">Mission</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Utilize technology and engineering to address real-world challenges faced by communities in need.</li>
                <li>Raise awareness about social issues and inspire IEEE members to engage in impactful projects.</li>
                <li>Promote sustainable solutions aligned with IEEE's commitment to humanitarian advancement.</li>
                <li>Provide hands-on experience in humanitarian projects that develop skills and social responsibility.</li>
                <li>Build partnerships with other organizations to amplify social impact.</li>
              </ul>
            </section>

            {/* About */}
            <section className="bg-muted/30 p-8 rounded-xl shadow-lg animate-fade-in-up animation-delay-900">
              <h2 className="text-2xl font-semibold mb-6">About IEEE SOU SIGHT SBG</h2>
              <p className="mb-4">
                IEEE SOU SIGHT SBG (Special Interest Group on Humanitarian Technology) was formed to serve society using technology for the betterment of underserved communities. It focuses on solving social issues through engineering innovations.
              </p>
              <p>
                Despite being a relatively new group, IEEE SOU SIGHT SBG has launched impactful projects targeting education, healthcare, and sustainability. Students and professionals are encouraged to participate and create positive change through technology.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

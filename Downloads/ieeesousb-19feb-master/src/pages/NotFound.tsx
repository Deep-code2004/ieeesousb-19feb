
import { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-24">
        <div className="text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            We couldn't find the page you're looking for. The page might have been moved or doesn't exist.
          </p>
          <Button asChild>
            <Link to="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

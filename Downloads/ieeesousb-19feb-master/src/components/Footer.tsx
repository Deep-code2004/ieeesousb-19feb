import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";
import { SocialLink } from "@/types";
import { useTheme } from "@/lib/theme-provider";
import { SiX } from "react-icons/si"; // X (Twitter new logo)
import { SiThreads } from "react-icons/si"; // Threads logo
const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "Instagram",
    url: "https://www.instagram.com/ieee_silveroakuni/",
    icon: Instagram,
  },
  {
    platform: "X",
    url: "https://twitter.com/IEEE_SilverOak",
    icon: SiX,
  },
  {
    platform: "Facebook",
    url: "https://www.facebook.com/IEEESilverOakUni",
    icon: Facebook,
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/company/ieee-silveroakuni/",
    icon: Linkedin,
  },
];
export default function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="bg-primary/5 py-6 md:py-8 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          {/* Logo and description */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <div className="flex items-center justify-center">
                <img
                  src={
                    theme === "dark"
                      ? "http://ieee.socet.edu.in/wp-content/uploads/2025/09/Group-2085662984-1-scaled.png"
                      : "http://ieee.socet.edu.in/wp-content/uploads/2025/09/N_Wedge-removebg-preview.png"
                  }
                  alt="IEEE SOU SB Logo"
                  className="w-auto h-12 md:h-20 object-contain max-w-[300px] md:max-w-[350px]"
                />
              </div>
            </Link>
            <p className="text-xs md:text-sm text-muted-foreground max-w-md">
              Silver Oak University IEEE SB aims to give an interactive platform for students to
              develop professional and technical abilities. Since the start, it is successfully
              organizing various events with well-defined subjects.
            </p>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Contact Us</h3>
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-start">
                <Phone className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-muted-foreground">+91 79660 46304</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 md:h-5 md:w-5 mr-3 text-primary flex-shrink-0" />
                <div className="text-xs md:text-sm text-muted-foreground">
                  {/* Desktop view with dividers */}
                  <div className="hidden md:flex flex-wrap items-center">
                    <a href="mailto:ieee.fbc@socet.edu.in" className="hover:text-primary transition-colors">
                      ieee.fbc@socet.edu.in
                    </a>
                    <span className="mx-2 text-muted-foreground/50">|</span>
                    <a href="mailto:ieee.sc@socet.edu.in" className="hover:text-primary transition-colors">
                      ieee.sc@socet.edu.in
                    </a>
                    <span className="mx-2 text-muted-foreground/50">|</span>
                    <a href="mailto:ieee.tr@socet.edu.in" className="hover:text-primary transition-colors">
                      ieee.tr@socet.edu.in
                    </a>
                  </div>
                  {/* Mobile view stacked */}
                  <div className="md:hidden space-y-1">
                    <a href="mailto:ieee.fbc@socet.edu.in" className="block hover:text-primary transition-colors">
                      ieee.fbc@socet.edu.in
                    </a>
                    <a href="mailto:ieee.sc@socet.edu.in" className="block hover:text-primary transition-colors">
                      ieee.sc@socet.edu.in
                    </a>
                    <a href="mailto:ieee.tr@socet.edu.in" className="block hover:text-primary transition-colors">
                      ieee.tr@socet.edu.in
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-xs md:text-sm text-muted-foreground">
                  Silver Oak University, Nr. Bhavik Publications, Opp. Bhagwat Vidyapith, S.G.Highway,
                  Ahmedabad, Gujarat - 382481
                </span>
              </div>
            </div>
            {/* Social Links */}
            <div className="mt-4 md:mt-6">
              <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    <social.icon className="h-4 w-4 md:h-5 md:w-5" />
                  </a>
                ))}
                <a
                  href="https://www.threads.net/@ieee_silveroakuni"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Follow us on Threads"
                >
                  <SiThreads className="h-4 w-4 md:h-5 md:w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="pt-4 md:pt-6 border-t border-border/50 text-center">
          <p className="text-xs md:text-sm text-muted-foreground">
            &copy; Copyright Silver Oak University IEEE SB. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

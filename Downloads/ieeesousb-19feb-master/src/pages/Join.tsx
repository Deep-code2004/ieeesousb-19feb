import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function Join() {
  const [showNotification, setShowNotification] = useState(true);
  const [customToast, setCustomToast] = useState<string | null>(null);

  useEffect(() => {
    if (showNotification) {
      const id = toast.info(
        <div className="flex items-start justify-between w-full">
          <div className="text-foreground">
            Join IEEE form is inactive, kindly reach us at Apple Lab, B-120 for any queries
          </div>
          <button
            onClick={() => toast.dismiss(id)}
            className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
          >
            <X size={16} />
          </button>
        </div>,
        {
          duration: 5000,
          position: "bottom-right",
          className:
            "bg-background text-foreground border border-gray-200 dark:border-gray-700 shadow-lg",
          style: {
            fontSize: "1.1rem",
            padding: "1.25rem",
          },
          onDismiss: () => setShowNotification(false),
        }
      );
      setCustomToast(id ? String(id) : null);
    }

    const timer = setTimeout(() => {
      setShowNotification(false);
      if (customToast) {
        toast.dismiss(customToast);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(
      <div className="flex items-start justify-between w-full">
        <div className="text-foreground">
          Join IEEE form is inactive, kindly reach us at Apple Lab, B-120 for any queries
        </div>
        <button
          onClick={() => toast.dismiss()}
          className="ml-2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <X size={16} />
        </button>
      </div>,
      {
        position: "bottom-right",
        className:
          "bg-background text-foreground border border-gray-200 dark:border-gray-700 shadow-lg",
        style: {
          fontSize: "1.1rem",
          padding: "1.25rem",
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Join IEEE SOU SB</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get access to cutting-edge information, networking opportunities, career enhancement, and other exclusive member benefits.
            </p>
          </div>

          <div className="rounded-lg p-8 border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 transition-colors">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Your full name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="Your phone number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="enrollment">Enrollment Number</Label>
                  <Input id="enrollment" placeholder="Your enrollment number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Input id="college" placeholder="SOCET or ASOIT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ce">Computer Engineering</SelectItem>
                      <SelectItem value="it">Information Technology</SelectItem>
                      <SelectItem value="ec">Electronics & Communication</SelectItem>
                      <SelectItem value="ee">Electrical Engineering</SelectItem>
                      <SelectItem value="me">Mechanical Engineering</SelectItem>
                      <SelectItem value="civil">Civil Engineering</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Academic Year</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">First Year</SelectItem>
                      <SelectItem value="2">Second Year</SelectItem>
                      <SelectItem value="3">Third Year</SelectItem>
                      <SelectItem value="4">Fourth Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Why do you want to join IEEE?</Label>
                <Textarea
                  id="reason"
                  placeholder="Tell us why you're interested in joining IEEE SOU SB"
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full">
                Submit Application
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

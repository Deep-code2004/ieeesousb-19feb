import React, { useState, useEffect } from "react";
import AwardModal from "../Admin/AwardModal";
import AwardPreviewList from "../Admin/AwardPreviewList"; // Check if this should be AwardsPreviewList
import EventModal from "../Admin/EventModal";
import EventPreviewList from "../Admin/EventPreviewList";
import MemberModal from "../Admin/MemberModal";
import MemberPreviewList from "../Admin/MemberPreviewList";
import Dashboard from "../Admin/Dashboard";
import AdminLayout from "../Admin/AdminLayout";
import { db } from "../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const Admin = () => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedAward, setSelectedAward] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Navigation handler from dashboard to specific tabs
  const handleNavigate = (section: string) => {
    console.log(`Navigating to section: ${section}`); // Debug log
    switch (section) {
      case 'events':
        setActiveTab('events');
        break;
      case 'awards':
        setActiveTab('awards');
        break;
      case 'members':
        setActiveTab('members');
        break;
      case 'addEvent':
        setSelectedEvent(null); // Clear any previous event
        setShowEventModal(true);
        setActiveTab('events');
        break;
      case 'addAward':
        setSelectedAward(null);
        setShowAwardModal(true);
        setActiveTab('awards');
        break;
      case 'addMember':
        setSelectedMember(null);
        setShowMemberModal(true);
        setActiveTab('members');
        break;
      case 'eventDetails':
        // If you decide to implement event details view
        setActiveTab('events');
        break;
      case 'awardDetails':
        // If you decide to implement award details view
        setActiveTab('awards');
        break;
      case 'memberDetails':
        // If you decide to implement member details view
        setActiveTab('members');
        break;
      default:
        setActiveTab('dashboard');
    }
  };

  // Edit Handlers
  const handleEditEvent = (event: any) => {
    console.log("Editing event:", event.id);
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  const handleEditAward = (award: any) => {
    console.log("Editing award:", award.id);
    setSelectedAward(award);
    setShowAwardModal(true);
  };

  const handleEditMember = (member: any) => {
    console.log("Editing member:", member.id);
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  // Delete Handlers
  const handleDeleteEvent = async (id: string) => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection.");
      return;
    }
    try {
      console.log("Deleting event:", id);
      await deleteDoc(doc(db, "events", id));
      setSuccessMessage("Event deleted successfully.");
    } catch (err: any) {
      console.error("Delete event error:", err);
      setErrorMessage(`Error deleting event: ${err.message}`);
    }
  };
  
  const handleDeleteAward = async (id: string) => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection.");
      return;
    }
    try {
      console.log("Deleting award:", id);
      await deleteDoc(doc(db, "awards", id));
      setSuccessMessage("Award deleted successfully.");
    } catch (err: any) {
      console.error("Delete award error:", err);
      setErrorMessage(`Error deleting award: ${err.message}`);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection.");
      return;
    }
    try {
      console.log("Deleting member:", id);
      await deleteDoc(doc(db, "members", id));
      setSuccessMessage("Member deleted successfully.");
    } catch (err: any) {
      console.error("Delete member error:", err);
      setErrorMessage(`Error deleting member: ${err.message}`);
    }
  };

  // Clear messages after a timeout
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, errorMessage]);

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {/* Notification alerts */}
      {successMessage && (
        <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      {errorMessage && (
        <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800" variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} className="space-y-6">
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="m-0">
          <Dashboard 
            navigateTo={handleNavigate}
            setSelectedEvent={setSelectedEvent}
            setSelectedAward={setSelectedAward}
            setSelectedMember={setSelectedMember}
          />
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6 m-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Events Management</h2>
            <Button 
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
            >
              Add New Event
            </Button>
          </div>
          <EventPreviewList 
            onEdit={handleEditEvent} 
            onDelete={handleDeleteEvent} 
            setSuccess={setSuccessMessage} 
            setError={setErrorMessage}
          />
        </TabsContent>

        {/* Awards Tab */}
        <TabsContent value="awards" className="space-y-6 m-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Awards Management</h2>
            <Button 
              onClick={() => {
                setSelectedAward(null);
                setShowAwardModal(true);
              }}
            >
              Add New Award
            </Button>
          </div>
          <AwardPreviewList 
            onEdit={handleEditAward} 
            onDelete={handleDeleteAward} 
            setSuccess={setSuccessMessage} 
            setError={setErrorMessage}
          />
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="space-y-6 m-0">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Members Management</h2>
            <Button 
              onClick={() => {
                setSelectedMember(null);
                setShowMemberModal(true);
              }}
            >
              Add New Member
            </Button>
          </div>
          <MemberPreviewList 
            onEdit={handleEditMember} 
            onDelete={handleDeleteMember} 
            setSuccess={setSuccessMessage} 
            setError={setErrorMessage}
          />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          setSuccess={setSuccessMessage}
          setError={setErrorMessage}
        />
      )}

      {showAwardModal && (
        <AwardModal
          isOpen={showAwardModal}
          onClose={() => {
            setShowAwardModal(false);
            setSelectedAward(null);
          }}
          award={selectedAward}
          setSuccess={setSuccessMessage}
          setError={setErrorMessage}
        />
      )}

      {showMemberModal && (
        <MemberModal
          isOpen={showMemberModal}
          onClose={() => {
            setShowMemberModal(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          setSuccess={setSuccessMessage}
          setError={setErrorMessage}
        />
      )}
    </AdminLayout>
  );
};

export default Admin;
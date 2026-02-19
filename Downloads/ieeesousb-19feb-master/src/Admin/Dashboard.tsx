import React, { useState, useEffect } from 'react';
import { db } from "../firebase";
import { collection, query, orderBy, getDocs, Timestamp, limit } from "firebase/firestore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  CircleUser,
  CalendarDays,
  Award,
  Bell,
  Calendar,
  Clock,
  ChevronRight,
  Plus,
  Loader2
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

interface DashboardProps {
  navigateTo: (section: string) => void;
  setSelectedEvent?: (event: any) => void;
  setSelectedAward?: (award: any) => void;
  setSelectedMember?: (member: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  navigateTo,
  setSelectedEvent,
  setSelectedAward,
  setSelectedMember
}) => {
  const [eventsCount, setEventsCount] = useState<number>(0);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [awardsCount, setAwardsCount] = useState<number>(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // New state to store all events and awards
  const [events, setEvents] = useState<any[]>([]);
  const [awards, setAwards] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch events 
        const eventsQuery = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const eventsSnapshot = await getDocs(eventsQuery);
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'event'
        }));
        setEvents(eventsList);
        setEventsCount(eventsSnapshot.size);

        // Fetch members
        const membersQuery = query(collection(db, "members"), orderBy("createdAt", "desc"));
        const membersSnapshot = await getDocs(membersQuery);
        const membersList = membersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'member'
        }));
        setMembers(membersList);
        setMembersCount(membersSnapshot.size);

        // Fetch awards
        const awardsQuery = query(collection(db, "awards"), orderBy("createdAt", "desc"));
        const awardsSnapshot = await getDocs(awardsQuery);
        const awardsList = awardsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: 'award'
        }));
        setAwards(awardsList);
        setAwardsCount(awardsSnapshot.size);

        // Combine and sort for recent activity
        const allItems = [...eventsList, ...membersList, ...awardsList];
        const sortedItems = allItems.sort((a, b) => {
          const aDate = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date();
          const bDate = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date();
          return bDate.getTime() - aDate.getTime();
        });
        
        setRecentActivity(sortedItems.slice(0, 10)); // Get the 10 most recent items
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'event':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'award':
        return <Award className="h-4 w-4 text-amber-500" />;
      case 'member':
        return <CircleUser className="h-4 w-4 text-green-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  // Handle click on recent activity items
  const handleActivityClick = (item: any) => {
    switch (item.type) {
      case 'event':
        if (setSelectedEvent) setSelectedEvent(item);
        navigateTo('eventDetails');
        break;
      case 'award':
        if (setSelectedAward) setSelectedAward(item);
        navigateTo('awardDetails');
        break;
      case 'member':
        if (setSelectedMember) setSelectedMember(item);
        navigateTo('memberDetails');
        break;
      default:
        break;
    }
  };

  // Handle navigation to sections with data
  const handleNavigateToEvents = () => {
    console.log("Navigating to events section");
    navigateTo('events');
  };

  const handleNavigateToAwards = () => {
    console.log("Navigating to awards section");
    navigateTo('awards');
  };

  const handleNavigateToMembers = () => {
    console.log("Navigating to members section");
    navigateTo('members');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="mt-3 text-center">
          <h3 className="font-medium text-base">Loading dashboard</h3>
          <p className="text-xs text-muted-foreground">Fetching your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading dashboard data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 w-full overflow-x-hidden px-2 sm:px-4">
      <h2 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h2>
      
      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {/* Events Card */}
        <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={handleNavigateToEvents}>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Events</CardTitle>
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{eventsCount}</div>
            <p className="text-xs text-muted-foreground">Total events</p>
          </CardContent>
        </Card>

        {/* Awards Card */}
        <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={handleNavigateToAwards}>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Awards</CardTitle>
            <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{awardsCount}</div>
            <p className="text-xs text-muted-foreground">Total awards</p>
          </CardContent>
        </Card>

        {/* Members Card */}
        <Card className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={handleNavigateToMembers}>
          <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium">Members</CardTitle>
            <CircleUser className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6 pt-0">
            <div className="text-xl sm:text-2xl font-bold">{membersCount}</div>
            <p className="text-xs text-muted-foreground">Total registered members</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card className="col-span-1">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Recent changes across all content</CardDescription>
          </CardHeader>
          <CardContent className="max-h-[250px] sm:max-h-[280px] md:max-h-[320px] overflow-auto px-3 sm:px-6 py-2 sm:py-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs sm:text-sm text-muted-foreground">No recent activity</p>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {recentActivity.map((item, i) => {
                  const date = item.createdAt instanceof Timestamp ? item.createdAt.toDate() : new Date();
                  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
                  
                  let title = 'Unnamed Item';
                  if (item.title) title = item.title;
                  else if (item.name) title = item.name;

                  let typeLabel = '';
                  switch(item.type) {
                    case 'event': typeLabel = 'Event'; break;
                    case 'award': typeLabel = 'Award'; break;
                    case 'member': typeLabel = 'Member'; break;
                  }
                  
                  return (
                    <div 
                      key={item.id + i} 
                      className="flex items-center gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                      onClick={() => handleActivityClick(item)}
                    >
                      <div className="rounded-full p-1 flex-shrink-0">
                        {getActivityIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <p className="text-sm font-medium leading-tight truncate">{title}</p>
                        <p className="text-xs text-muted-foreground">{typeLabel} {timeAgo}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card className="col-span-1">
          <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 py-2 sm:py-3">
            <Button 
              variant="outline" 
              className="w-full justify-between text-sm" 
              size="sm"
              onClick={() => navigateTo('addEvent')}
            >
              <span className="flex items-center">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New Event
              </span>
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between text-sm" 
              size="sm"
              onClick={() => navigateTo('addAward')}
            >
              <span className="flex items-center">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New Award
              </span>
              <Award className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-between text-sm" 
              size="sm"
              onClick={() => navigateTo('addMember')}
            >
              <span className="flex items-center">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New Member
              </span>
              <CircleUser className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <Card>
        <CardHeader className="pb-1 sm:pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg">Content Distribution</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Overview of your site content</CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 py-2 sm:py-3">
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {/* Content distribution progress bars */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-500" />
                  <span>Events</span>
                </div>
                <span>{eventsCount}</span>
              </div>
              <Progress value={eventsCount} max={eventsCount + awardsCount + membersCount || 1} className="h-1.5 sm:h-2" />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center">
                  <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-amber-500" />
                  <span>Awards</span>
                </div>
                <span>{awardsCount}</span>
              </div>
              <Progress value={awardsCount} max={eventsCount + awardsCount + membersCount || 1} className="h-1.5 sm:h-2" />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center">
                  <CircleUser className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-500" />
                  <span>Members</span>
                </div>
                <span>{membersCount}</span>
              </div>
              <Progress value={membersCount} max={eventsCount + awardsCount + membersCount || 1} className="h-1.5 sm:h-2" />
            </div>
          </div>
          
          {/* Content tabs */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
            <Card className="p-2 sm:p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={handleNavigateToEvents}>
              <div className="flex flex-col items-center">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Events</span>
                <Button variant="link" size="sm" className="mt-0.5 h-auto p-0 text-xs">View all</Button>
              </div>
            </Card>
            
            <Card className="p-2 sm:p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={handleNavigateToAwards}>
              <div className="flex flex-col items-center">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Awards</span>
                <Button variant="link" size="sm" className="mt-0.5 h-auto p-0 text-xs">View all</Button>
              </div>
            </Card>
            
            <Card className="p-2 sm:p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors" onClick={handleNavigateToMembers}>
              <div className="flex flex-col items-center">
                <CircleUser className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mb-1" />
                <span className="text-xs sm:text-sm font-medium">Members</span>
                <Button variant="link" size="sm" className="mt-0.5 h-auto p-0 text-xs">View all</Button>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
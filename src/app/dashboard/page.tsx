'use client';


import { DarkThemeAiChatbot } from "@/components/dark-theme-ai-chatbot";
import LitterLogsTable from "@/components/litterlogs/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useUser } from "@/contexts/usercontext";
import { Bell, Calendar, ChevronDown, LogOut, Mail, Menu, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const devUrl = process.env.NEXT_PUBLIC_DEV_URL;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, setUser } = useUser();
  const router = useRouter();

  const [isActionEnabled, setIsActionEnabled] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (!user) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          console.log(user)
          // Check if the user exists in the backend
          const response = await fetch(`${devUrl}/users/checkuser/${JSON.parse(user)?.email}`, {
            method: 'GET',
          });

          if (!response.ok) {
            // Redirect if the user is not valid
            router.replace("/signin");
          }
        } else {
          // Redirect if no user is found
          router.replace("/signin");
        }
      }
    };
    checkUser();
  }, [user, setUser, router, devUrl]);
  
  if (!user) {
    return <p>Loading...</p>;
  }

  function signOut(){
    if (window.google && window.google.accounts && window.google.accounts.id){
      window.google.accounts.id.disableAutoSelect();
    }
    localStorage.removeItem('user');
    setUser(null);
    router.replace('/signin');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between p-4 bg-black border-b border-white/10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-6 w-6" />
          </Button>
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 hover:text-black">
                <img src={user?.imageUrl || "/placeholder.svg?height=32&width=32"} className="w-8 h-8 rounded-full" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-[#2c2d2e] border-none shadow-lg mr-5">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-[#00ff9d]">{user?.name}</h4>
                  <p className="text-sm text-gray-400">Pro Environmentalist</p>
                  <div className="flex items-center pt-2">
                    <Mail className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-gray-400">{user?.email}</span>
                  </div>
                  <div className="flex items-center pt-2">
                    <Calendar className="mr-2 h-4 w-4 opacity-70" />
                    <span className="text-xs text-gray-400">Joined December 2021</span>
                  </div>
                </div>
                <img src={user?.imageUrl || "/tree.jpg"} className="w-[50px] h-[50px] rounded-full" />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={signOut} >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-6 space-y-6">
        {/* Cards Row */}
        
        {/*Map section*/}
        <Card className="bg-black border border-white/10 shadow-lg p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold text-[#00ff9d]">Location Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow">
              <div className="aspect-video w-full">
                <iframe
                src="https://google-maps-component.vercel.app/"
                width="100%"
                height="100%"
                style={{border: 0}}
                allowFullScreen
                loading="lazy"
                ></iframe>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="p-4 bg-black-100 text-white rounded-md bold-md">
                <h2 className="md:text-lg font-bold">Hello</h2>
                <p>Welcome to our app</p>
              </div>
              <div>
              <Button
                  className={`w-full px-4 py-2 rounded-md transition-colors ${
                    isActionEnabled
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                  onClick={() => setIsActionEnabled(!isActionEnabled)}
                >
                  {isActionEnabled ? 'Cancel Pickup' : 'Schedule Pickup'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        </Card>

        {/*Log Table*/}
        <LitterLogsTable />

        
        <DarkThemeAiChatbot />
      </main>
    </div>
  )
}
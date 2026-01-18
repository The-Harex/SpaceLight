import Banner from "@/components/Banner";
import ISSTracker from "@/components/ISSTracker";
import LaunchFeed from "@/components/LaunchFeed";
import SpaceWeather from "../components/SpaceWeather";
import PeopleInSpace from "@/components/PeopleInSpace";
import MoonPhase from "../components/MoonPhase";
import VisiblePlanets from "@/components/VisiblePlanets";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      
      <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
        <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 tracking-tight">
              SpaceLight
            </h1>
            <p className="text-lg text-slate-400 font-light mt-1">
              Your gateway to the cosmos - made by Ryan Finney
            </p>
          </div>
          <div className="hidden md:block text-right">
             {/* Space for additional header info if needed */}
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
          
          {/* Main Feature: ISS Tracker (2x2 on Large, 2x1 on Medium) */}
          <div className="md:col-span-2 lg:col-span-3 lg:row-span-2 min-h-[400px]">
            <ISSTracker />
          </div>

          {/* Right Column: Launch Feed */}
          <div className="lg:col-span-1 lg:row-span-2">
            <LaunchFeed />
          </div>

          {/* Bottom Row / Secondary Grid */}
          <div className="md:col-span-1">
             <MoonPhase />
          </div>
          <div className="md:col-span-1">
            <SpaceWeather />
          </div>
          <div className="md:col-span-1">
            <PeopleInSpace />
          </div>
          <div className="md:col-span-1">
            <VisiblePlanets />
          </div>

        </div>
      </div>
      
      <footer className="p-6 text-center text-slate-500 text-sm bg-slate-900/40 mt-auto">
        <p>SpaceLight &copy; {new Date().getFullYear()} | Data provided by NASA, SpaceDevs, and OpenNotify.</p>
        <p className="mt-2">Please contact <a href="mailto:ryan.finney87@gmail.com" className="hover:text-blue-400 transition-colors">ryan.finney87@gmail.com</a> for inquiries</p>
      </footer>
    </div>
  );
}

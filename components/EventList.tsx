'use client'

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "./Spinner";
import { CalendarDays,  Ticket } from "lucide-react";
import EventCard from "./EventCard";

function EventList ()  {


 const events = useQuery(api.events.get);

 if (!events) {
    return(
    <div className="flex items-center justify-center min-h-[300px]">
        <Spinner/>
    </div>
    )
 };

 const upcomingEvents = events
 .filter((event)=>event.eventDate>Date.now())
 .sort((a,b)=>a.eventDate-b.eventDate)

 const postEvents = events
 .filter((event)=>event.eventDate<=Date.now())
 .sort((a,b)=>b.eventDate-a.eventDate)
   return (
      <div className="max-w-6xl px-4 py-10 mx-auto sm:px-5 lg:px-7">
         <div className="flex justify-between items-center mb-7">
            <div>
               <h1 className="text-gray-800 font-bold text-2xl">Upcoming Events</h1>
               <p>
                  Discover Upcoming events & book tickets
               </p>
            </div>
            <div className="bg-white px-4 py-2 shadow-sm rounded-lg border-gray-100">
               <div className="flex items-center text-gray-600 gap-2">
                  <CalendarDays className="w-4 h-4"/>
                <span className="text-gray-500 font-medium">
                  {upcomingEvents.length} Upcoming Events
                </span>
               </div>
            </div>
         </div>


         {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-11">
                {upcomingEvents.map((event)=>(
                  <EventCard key={event._id} eventId={event._id}/>
                ))}
            </div>
         ):(
            <div className="bg-gray-50 text-center rounded-lg p-12 mb-11">
               <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
               <h3>
                  No Upcoming Events
                  
               </h3>
               <p>Check back later for events</p>
            </div>
         )}  
   
   {/* {upcomingEvents.length > 0 &&  (
           <>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-11">
                {upcomingEvents.map((event)=>(
                  <EventCard key={event._id} eventId={event._id}/>
                ))}
            </div>
            </>
            ) 
         } */}

      {postEvents.length > 0 && (
         <>
           <h2 className="text-gray-800 font-bold text-2xl mb-5">Past Events</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {postEvents.map((event) => (
               <EventCard key={event._id} eventId={event._id} />
             ))}
           </div>
         </>
       )}
      
      </div>
   )
  
}

export default EventList
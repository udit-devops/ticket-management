"use Client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Client } from "@clerk/nextjs/server";
import { useQuery } from "convex/react";
import { CalendarDays, Check, CircleArrowLeft, CircleArrowRight, LoaderCircle, MapIcon, PencilIcon, StarIcon, Ticket, XCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
function EventCard({ eventId }: { eventId: Id<"events"> }) {
  const { user } = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getById, { eventId });
  const availability = useQuery(api.events.getEventAvailability, { eventId });

  const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId: user?.id ?? "",
  });

  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });
  const imageUrl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return null;
  }

  const isPastEvent = event.eventDate < Date.now();
  const isEventOwner = user?.id == event?.userId;

const renderQueuePosition=()=>{
   if(!queuePosition || queuePosition.status !=="waiting") return null;

 if (availability.purchasedCount >= availability.totalTickets) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 ">
     <div className="flex items-center">
     <Ticket className="w-5 h-5 text-gray-400 mr-2"/>
     <span className=" text-gray-700 "> Event is Sold Out</span>
     </div>
    </div>
 );
 }  
 if (queuePosition.position == 2) {
  return(
    <div className="flex flex-col lg:flex-row items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
      <div className="flex items-center">
        <CircleArrowRight className="w-5 h-5 text-amber-400 mr-2"/>
        <span className="text-amber-700 font-medium">
       You&apos;re next in line!(Queue position:{""}
       {queuePosition.position})
        </span>
      </div>
      <div className="flex items-center ">
        <LoaderCircle className="w-4 h-4 animate-spin mr-1 text-amber-400"/>
        <span className="text-amber-500 text-sm">Waiting For Ticket</span>

      </div>
    </div>
  )
 }
 return (
  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 ">
    <div className=" flex items-center">
    <LoaderCircle className="w-4 h-4 mr-2 animate-spin text-blue-500 "/>
      <span className="text-blue-600">
     Queue Position
      </span>

    </div>
    <span className="bg-blue-100 text-blue-500 px-3 py-1 rounded-full font-medium">
     #{queuePosition.position}
    </span>
  </div>
 )
 }
  const renderTicketStatus=()=>{
    if(!user) return null;
    if(isEventOwner)
      
      return(
      <div className="mt-4">
        <button
        onClick={(e)=>{
          e.stopPropagation();
          router.push(`/seller/events/${eventId}/edit`);
        }}
        className="w-full bg-gray-100 text-gray-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transtion-colors duration-200 shadow-sm flex items-center justify-center gap-2"
        >
          <PencilIcon className='w-4 h-4'/>
          Edit Event

        </button>

      </div>
      );
  
  if(userTicket) {
    return(
      <div className="mt-4 flex items-center justify-between p-3 bg-green-50 rounded-lg border-green-100">
        <div className="flex items-center">
         <Check className="h-4 w-4 text-green-500 mr-2"/>
         <span className="text-green-600 font-medium">
          You have a ticket!
         </span>
        </div>
         <button
         onClick={()=> router.push(`/tickets/${userTicket._id}`)}
         className="text-sm bg-green-500 hover:bg-green-700 text-white px-3 py-1.5 rounded-full font-medium shadow-sm transition-colors duration-300 flex items-center gap-1"
         >
      View your ticket
         </button>
      </div>
    );
  }

  if (queuePosition) {
    return(
      <div className="mt-4">\
      {queuePosition.status === "offered" && (
        <PurchasedTicket eventId={eventId}/>
      )}
 {renderQueuePosition()}
 {queuePosition.status==="expired"&&(
  <div className="p-3 bg-red-50 rounded-lg border-red-100 uhhgghjhhgh">
    <span className="text-red-500 font font-medium flex items-center">
     <XCircle className="w-5 h-5 mr-2"/>
     Offer Expired
    </span>
  </div>
 )}
      </div>
    )

  }
  return null;
};
  return (
    <div
      onClick={() => router.push(`/event/${eventId}`)}
      className={` bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-304 border border-gray-200 cursor-pointer overflow-hidden relative ${isPastEvent ? "opacity-75 hover:opacity-100 " : ""}`}
    >
      {imageUrl && (
        <div className="relative h-47 w-full">
          <Image
            src={imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-tr" />
        </div>
      )}

      <div className={`p-6 ${imageUrl ? "relative" : ""}`}>
        <div className="flex justify-center items-start">
          <div>
            <div className="flex flex-col items-start gap-2">
              {isEventOwner && (
                <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-xs font-medium">
                  <StarIcon className="w-3 h-2" />
                  Your Event
                </span>
              )}
              <h2 className="text-2xl text-gray-600 font-semibold ">
                {event.name}
              </h2>
            </div>
            {isPastEvent && (
              <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium bg-gray-200 text-gray-400 mt-3">
                Past Event
              </span>
            )}
          </div>
        </div>

        {/* Price tag */}
        <div className="flex flex-col items-end gap-2 ml-3">
          <span
            className={`px-4 py-1.5 font-semibold rounded-full ${
              isPastEvent
                ? "bg-gray-50 text-gray-600"
                : "bg-green-50 text-green-600"
            }`}
          >
          $ {event.price.toFixed(2)}
          </span>
          
         {availability.purchasedCount >= availability.totalTickets && (
          <span className="px-4 py-1.5 bg-red-50 text-red-500 font-semibold rounded-full text-sm">
            Sold Out
         </span>
         )}
          
        </div>
        <div className="mt-4 space-y-3">
           <div className="flex items-center text-gray-600">
                <MapIcon className="w-4 h-4 mr-2"/>
                <span>{event.location}</span>
           </div>
           <div className="flex items-center bg-gray-600">
             <CalendarDays className="w-4 h-4 mr-2"/>
             <span>
              {new Date(event.eventDate).toLocaleDateString()}{""}
              {isPastEvent && "(Ended)"}
             </span>
           </div>
           <div className="flex items-center text-gray-600">
            <Ticket className="w-4 h-4 mr-2"/>
            <span>
              {availability.totalTickets - availability.purchasedCount}/ {""}
              {availability.totalTickets} available
              {!isPastEvent && availability.activeOffers >0 && (
                <span>
                  ({availability.activeOffers}{""}
                  {availability.activeOffers === 1 ? "person" : "people"} trying to buy )
                 
                </span>
              )}
            </span>
           </div>
        </div>
        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {event.description}
        </p>
        <div onClick={(e)=> e.stopPropagation()}>
          {!isPastEvent && renderTicketStatus()}
        </div>
      </div>
    </div>
  );
}

export default EventCard;

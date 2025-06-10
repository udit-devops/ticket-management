"use Client";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStorageUrl } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Client } from "@clerk/nextjs/server";
import { useQuery } from "convex/react";
import { CalendarDays, MapIcon, StarIcon, Ticket } from "lucide-react";
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
          {!isPastEvent && renderTicketStatus}
        </div>
      </div>
    </div>
  );
}

export default EventCard;

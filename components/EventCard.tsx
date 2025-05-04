'use Client'
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { useStorageUrl } from '@/lib/utils';
import { useUser } from '@clerk/nextjs'
import { Client } from '@clerk/nextjs/server'
import { useQuery } from 'convex/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
function EventCard ({eventId}:{eventId : Id<"events">})  {
  const {user} = useUser();
  const router = useRouter();
  const event = useQuery(api.events.getById,{eventId})
 const availability = useQuery(api.events.getEventAvailability,{eventId})

 const userTicket = useQuery(api.tickets.getUserTicketForEvent,{
  eventId,
  userId: user?.id??"",
 });
 
 const queuePosition = useQuery(api.waitingList.getQueuePosition,{
  eventId,
  userId: user?.id??"",

 });
const imageUrl = useStorageUrl(event?.imageStorageId);

if (!event || !availability){
  return null
}

const isPastEvent= event.eventDate<Date.now();
const isEventOwner = user?.id == event?.userId;
  return (
    <div 
    onClick={()=>router.push(`/event/${eventId}`)}
    className={` bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-304 border border-gray-200 cursor-pointer overflow-hidden relative ${isPastEvent? "opacity-75 hover:opacity-100 " : ""}`}
    >
      {imageUrl &&(
        <div className='relative h-47 w-full'>
          <Image
          src={imageUrl}
          alt={event.name}
          fill
          className='object-cover'
          priority 
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/45 to-tr'/>

        </div>
      )}

      <div className={`p-6 ${imageUrl ? "relative":""}`}>

      </div>
    </div>
  )
}

export default EventCard;
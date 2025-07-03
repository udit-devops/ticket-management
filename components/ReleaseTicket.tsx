"use client"
import React from 'react'
import { api } from '@/convex/_generated/api'
import { useMutation } from 'convex/react'
import { useState} from 'react'
import { XCircle } from 'lucide-react'
import { Id } from '@/convex/_generated/dataModel'
import { releaseTicket } from '@/convex/waitingList'
function ReleaseTicket({
  eventId,
  waitingListId,
}:{
  eventId:Id<"events">;
  waitingListId: Id<"waitingList">
}){
 const [isReleasing ,setIsReleasing] = useState(false);
 const releaseTicket = useMutation(api.waitingList.releaseTicket)
 
 const handleRelease = async()=>{
 if (!confirm("are you sure you want to relase the ticket offer"))
  return;
 

 try {
  setIsReleasing(true)
  await releaseTicket({
    eventId,
    waitingListId,
  })
 } catch (error) {
  console.log("error release ticket",error);
}
finally{
setIsReleasing(false)
}
 }
  return (
<button
onClick={handleRelease}
disabled={isReleasing}
className='mt-2 w-full flex items-center justify-between gap-2 py-2 px-4 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed'

>
<XCircle className='w-4 h-4'/>
{isReleasing ?"is Releasing...." : "Release Ticket"}
</button>
  )
}

export default ReleaseTicket
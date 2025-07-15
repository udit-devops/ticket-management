"use client";
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery } from 'convex/react';
import React from 'react'

 function JoinQueue({
eventId,
userId,
 }:{
eventId:Id<"events">,
userId : Id<"users">
 }){
      const {toast}= useToast();
      const joinWaitingList = useMutation(api.events.joinWaitingList);
      const queuePosition = useQuery (api.waitingList.getQueuePosition,{
   eventId,
   userId,
      });
const userTicket = useQuery(api.tickets.getUserTicketForEvent, {
    eventId,
    userId,
})
    return <div>JoinQueue</div>
 }
export default JoinQueue
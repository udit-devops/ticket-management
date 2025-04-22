import { v } from 'convex/values';
import {query,mutation} from './_generated/server'
import { Ticket } from 'lucide-react';
import { TICKET_STATUS, WAITING_LIST_STATUS } from './constants';

export const get = query({
    args:{},
    handler:async (ctx)=>{
     return await ctx.db
     .query("events")
     .filter((q)=>q.eq(q.field("is_cancelled"),undefined))
     .collect();
    },
});





export const getById = query({
    args:{eventId: v.id("events")},
    handler:async (ctx ,{eventId})=>{
     return await ctx.db.get(eventId)
    },
});


export const getEventAvailability = query({
    args:{eventId: v.id("events")},
    handler:async (ctx ,{eventId})=>{
        const event = await ctx.db.get(eventId)
        if(!event) throw new Error("event not found");

        
        const purchasedCount = await ctx.db
        .query("tickets")
        .withIndex("by_event",(q)=> q.eq("eventId",eventId))
        .collect()
        .then(
         (tickets) =>
            tickets.filter(
                (t) => 
                    t.status=== TICKET_STATUS.valid ||
                    t.status===TICKET_STATUS.valid
            ).length
        );
        const now = Date.now()
        const activeOffers = await ctx.db
        .query("waitingList")
        .withIndex("by_event_status",(q)=>
        q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.OFFERED)
        )
        .collect()
        .then(
            (entries)=> entries.filter((e)=>(e.offerExpiersAt ?? 0 ) > now).length
        );

    
          const totalResrved = purchasedCount+activeOffers;
          return{
                  isSoldOut:totalResrved >= event.totalTickets,
                  purchasedCount,
                  totalTickets:event.totalTickets,
                  activeOffers,
                  remainingTickets: Math.max(0,event.totalTickets-totalResrved)
          }








    },
});











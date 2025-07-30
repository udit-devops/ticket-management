import { ConvexError, v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Key, Ticket } from "lucide-react";
import { DURATION, TICKET_STATUS, WAITING_LIST_STATUS } from "./constants";
import { error } from "console";
import { internal } from "./_generated/api";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("is_cancelled"), undefined))
      .collect();
  },
});

export const getById = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    return await ctx.db.get(eventId);
  },
});

export const getEventAvailability = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, { eventId }) => {
    const event = await ctx.db.get(eventId);
    if (!event) throw new Error("event not found");

    const purchasedCount = await ctx.db
      .query("tickets")
      .withIndex("by_event", (q) => q.eq("eventId", eventId))
      .collect()
      .then(
        (tickets) =>
          tickets.filter(
            (t) =>
              t.status === TICKET_STATUS.valid ||
              t.status === TICKET_STATUS.valid
          ).length
      );
    const now = Date.now();
    const activeOffers = await ctx.db
      .query("waitingList")
      .withIndex("by_event_status", (q) =>
        q.eq("eventId", eventId).eq("status", WAITING_LIST_STATUS.OFFERED)
      )
      .collect()
      .then(
        (entries) => entries.filter((e) => (e.offerExpiersAt ?? 0) > now).length
      );

    const totalResrved = purchasedCount + activeOffers;
    return {
      isSoldOut: totalResrved >= event.totalTickets,
      purchasedCount,
      totalTickets: event.totalTickets,
      activeOffers,
      remainingTickets: Math.max(0, event.totalTickets - totalResrved),
    };
  },
});

export const checkAvailability = query({
  args:{eventId:v.id("events")},
  handler : async (ctx , {eventId})=>{
   const event = await ctx.db.get(eventId)
    if(!event) throw new Error("event not found")
      const purchasedCount = await ctx.db
    .query("tickets")
    .withIndex("by_event",(q)=>q.eq("eventId",eventId))
    .collect()
    .then(
      (tickets)=>
       tickets.filter (
       (t)=>
        t.status === TICKET_STATUS.VALID ||
       t.status === TICKET_STATUS.USED
       ).length
    );
    const now  = Date.now();
    const activeOffers = await ctx.db
    .query("waitingList")
    .withIndex("by_event_status",(q)=>
    q.eq("eventId",eventId).eq("status",WAITING_LIST_STATUS.OFFERED)
    )
    .collect()
    .then(
      (entries)=> entries.filter((e)=>(e.offerExpiersAt ?? 0)> now).length
    )
    const availableSpots = event.totalTickets - (purchasedCount+activeOffers);
    return {
      available:availableSpots>0,
      availableSpots,
      totalTickets: event.totalTickets,
      purchasedCount,
      activeOffers,
    };
  }
})

export const joinWaitingList = mutation ({
    args:{eventId: v.id("events"),userId:v.string()},
handler :async (ctx,{eventId,userId})=>{
  //rate limit check 
  // const status = await rateLimiter.limit(ctx,"queueJoin",{Key:userId});
    // if ( !status.ok) {
    //   throw new ConvexError(
    //     `you have joined the waiting list too many times.please wait${Math.ceil(
    //       status.retryAfter / (60 * 1000)
    //     )}minutes beforetrying again`
    //   );
      
    // }

  const existingEntry = await ctx.db
  .query("waitingList")
  .withIndex("by_user_event",(q) => 
        q.eq("userId",userId).eq("eventId",eventId)
)
 .filter((q)=> q.neq(q.field("status"),WAITING_LIST_STATUS.EXPIRED))
 .first()

if (existingEntry) {
  throw new Error("already in the waiting list for this event")
}
const event = ctx.db.get(eventId);
if(!event) throw new Error("event not found")
  const {available}= await checkAvailability(ctx,{eventId});

const now = Date.now();
 if (available) {
      // If tickets are available, create an offer entry
      const waitingListId = await ctx.db.insert("waitingList", {
        eventId,
        userId,
        status: WAITING_LIST_STATUS.OFFERED, // Mark as offered
        offerExpiersAt: now + DURATION.TICKET_OFFER, // Set expiration time
      });

      // Schedule a job to expire this offer after the offer duration
      await ctx.scheduler.runAfter(
        DURATION.TICKET_OFFER,
        internal.waitingList.expireOffer,
        {
          waitingListId,
          eventId,
        }
      );
    } else{
      await ctx .db.insert("waitingList",{
        eventId,
        userId,
        status: WAITING_LIST_STATUS.WAITING,
      });
    }
return{
  success:true,
  status:available ? WAITING_LIST_STATUS.OFFERED : WAITING_LIST_STATUS.WAITING,
  message : available ? `ticket - offered you have ${DURATION.TICKET_OFFER} to purchase`: "you have been added to waiting list - you will be notified once it get available "

};
}
})

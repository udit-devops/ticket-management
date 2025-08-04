import { defineSchema , defineTable } from "convex/server";

import { v } from "convex/values";
import { list } from "postcss";


export default defineSchema({
    events:defineTable({
       name:v.string(),
       description:v.string(),
     location:v.string(),
     totalTickets:v.number(),
     eventDate:v.number(),
     price:v.number(),
     userId:v.string(),
     is_cancelled:v.optional(v.boolean()),
     imageStorageId:v.optional(v.id("_storage")) ,
    }),
    tickets :defineTable({
      eventId:v.id("events"),
      purchasedAt:v.number(),
      userId:v.string(),
      status:v.union(
         v.literal("used"),
         v.literal("cancelled"),
         v.literal("refunded"),
         v.literal("valid"),
      ),
      paymentIntentId:v.optional(v.string()),
      amount:v.optional(v.number()),
    })
    .index("by_event",["eventId"])
    .index("by_user",["userId"])
    .index("by_user_event",["userId" ,"eventId"])
    .index("by_payment_intent",["paymentIntentId"]),

    waitingList :defineTable({
      eventId:v.id("events"),
      userId:v.string(),
      status:v.union(
         v.literal("offered"),
         v.literal("waiting"),
         v.literal("purchased"),
         v.literal("expired"),
      ),
      
      offerExpiersAt:v.optional(v.number()),
    })
    .index("by_event_status",["eventId","status"])
    .index("by_user",["userId"])
    .index("by_user_event",["userId" ,"eventId"]),

    users :defineTable({
      name:v.string(),
      userId:v.string(),
      email:v.string(),
      
      stripeConnectId:v.optional(v.string()),
    })
    .index("by_email",["email"])
    .index("by_user_id",["userId"])
   
 
});
import { VALID_LOADERS } from "next/dist/shared/lib/image-config";
import { Doc } from "./_generated/dataModel";
import { CANCELLED } from "dns";

export const DURATION = {
TICKET_OFFER : 30*60*1000,

} as const;

export const WAITING_LIST_STATUS : Record<string,Doc<"waitingList">["status"]>=
{
WAITING:"waiting",
OFFERED:"offered",
PURCHASE:"purchased",
EXPIRE:"expired",
}as const;

export const TICKET_STATUS : Record<string,Doc<"tickets">["status"]>=
{
    VALID :"valid",
    REFUNDED:"refunded",
    USED:"used",
    CANCELLED:"cancelled",
    
}as const;
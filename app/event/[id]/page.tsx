'use client'

import { useUser } from "@clerk/nextjs"
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useStorageUrl } from "@/lib/utils";
import Spinner from "@/components/Spinner";

function Eventpage() {

    const {user} = useUser();
    const param = useParams();
    const event = useQuery (api.events.getById,{
        eventId:param.id as Id<"events">
    });
    const availability = useQuery(api.events.getEventAvailability,{
        eventId : param.id as Id<"events">
    });
    const imageurl = useStorageUrl(event?.imageStorageId)

    if (!event||!availability) {
        return(
            <div className="min-h-screen flex items-center justify-center">
                <Spinner/>
            </div>
        )
    }
return <div></div>  
}
export default Eventpage


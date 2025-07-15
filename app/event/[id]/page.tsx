"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useStorageUrl } from "@/lib/utils";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import { CalendarDays, MapPin, Ticket, User } from "lucide-react";
import EventCard from "@/components/EventCard";

function Eventpage() {
  const { user } = useUser();
  const param = useParams();
  const event = useQuery(api.events.getById, {
    eventId: param.id as Id<"events">,
  });
  const availability = useQuery(api.events.getEventAvailability, {
    eventId: param.id as Id<"events">,
  });
  const imageurl = useStorageUrl(event?.imageStorageId);

  if (!event || !availability) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl max-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {imageurl && (
            <div className="aspect-[21/9] relative w-full">
              <Image
                src={imageurl}
                alt={event.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-11">
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4 text-gray-900">
                    {event.name}
                  </h1>
                  <p className="text-lg text-gray-600">{event.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1 ">
                      <CalendarDays className="w-h h-5 mr-2 text-blue-600" />
                      <span className="text-sm font-medium"> Date </span>
                    </div>
                    <p className="text-gray-900">
                      {new Date(event.eventDate).toLocaleDateString()};
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center text-gray-600 mb-1">
         <MapPin className="w-5 h-5 mr-2 text-blue-600"/>
          <span className="text-sm font-medium">Location</span>
                    </div>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                <Ticket className="w-5 h-5 mr-2 text-blue-600"/>
                <span className="text-sm font-medium">Price</span>
                    </div>
                    <p className="text-gray-900">${event.price.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex items-center text-gray-600 mb-1">
                <User className="w-5 h-5 mr-2 text-blue-600"/>
                <span className="text-sm font-medium">Availability</span>
                    </div>
                    <p className="text-gray-900">
                     {availability.totalTickets - availability.purchasedCount}
                     {""}/{availability.totalTickets} left
                    </p> 
                  </div>

                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Event Informatin
              </h3>
              <ul className="space-y-2 text-blue-700">
                <li>Please arrive 30 minutes before the event start</li>
                <li>Tickets-are non refundable</li>
                <li>Age Restriciton:18+</li>
              
              </ul>
                </div>
              </div>
              <div>
                <div className="sticky top-8 space-y-4">
                  <EventCard eventId={param.id as Id<"events">}/>

                    {user ? (
                      <JoinQueue
                           eventId={param.id as Id<"events">}
                           userId = {user.id}
                      />
                    ):(
                      <SignInButton>
                        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                          Sign in to buy Tickets
                        </button>
                      </SignInButton>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Eventpage;

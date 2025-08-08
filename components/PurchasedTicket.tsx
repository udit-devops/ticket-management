'use client';
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ReleaseTicket from "./ReleaseTicket";
import { createStripeCheckoutSession } from "@/actions/createStripeCheckoutSession";

export const PurchasedTicket = ({ eventId }: { eventId: Id<"events"> }) => {
  const router = useRouter();
  const { user } = useUser();
  const queuePosition = useQuery(api.waitingList.getQueuePosition, {
    eventId,
    userId: user?.id ?? "",
  });

  const [timeRemaining, setTimeRemaining] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const offerExpiresAt = queuePosition?.offerExpiersAt ?? 0;
  const isExpired = Date.now() > offerExpiresAt;

  useEffect(() => {
    const calculateTimeReamining = () => {
      if (isExpired) {
        setTimeRemaining("Expired");
        return;
      }
      const diff = offerExpiresAt - Date.now();
      const minutes = Math.floor(diff / 100 / 60);
      const seconds = Math.floor((diff / 100) % 60);

      if (minutes > 0) {
        setTimeRemaining(
          `${minutes} minute${minutes === 1 ? "" : "s"} ${seconds} second${seconds === 1 ? "" : "S"}`
        );
      } else {
        setTimeRemaining(`${seconds} second${seconds === 1 ? "" : "s"}`);
      }
    };

    calculateTimeReamining();
    const interval = setInterval(calculateTimeReamining, 1000);
    return () => clearInterval(interval);
  }, [offerExpiresAt, isExpired]);

  // creating stripe checkout
  const handlePurchase = async () => {
       if (!user) return;

    try {
      setIsLoading(true);
      const { sessionUrl } = await createStripeCheckoutSession({
        eventId,
      });

      if (sessionUrl) {
        router.push(sessionUrl);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!user || !queuePosition || queuePosition.status !== "offered") {
    return null;
  }
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center">
                <Ticket className="w-5 h-4 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Ticket Reserved
                </h3>
                <p className="text-sm text-gray-500">
                  Expires in {timeRemaining}
                </p>
              </div>
            </div>
            <div className="text-gray-600 text-sm leading-relaxed">
              A ticket has been reserved for you complete your purchase before
              the time expires to secure your spot at this event.
            </div>
          </div>
        </div>
        <button 
        onClick={handlePurchase}
        disabled={isExpired||isLoading}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-4 rounded-lg font-bold shadow-md hover:from-amber-500 hover:to-amber-700 transform hover:scale-[1.02] transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:hover:scale-100 text-lg"
        >
{isLoading
?"redirecting Checkout" : "Purchase Your Ticket Now"}
        </button>
        <div className="mt-4">
             <ReleaseTicket eventId={eventId} waitingListId={queuePosition._id}/>
        </div>

      </div>
    </div>
  );
};
export default PurchasedTicket;

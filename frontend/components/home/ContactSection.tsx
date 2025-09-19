"use client";

import clsx from "clsx";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import EnvelopeIcon from "@/components/icons/EnvelopeIcon";
import LocationPinIcon from "@/components/icons/LocationPinIcon";
import PaperPlaneIcon from "@/components/icons/PaperPlaneIcon";
import PhoneFilledIcon from "@/components/icons/PhoneFilledIcon";
import { Button } from "@/components/ui/button";

// Response helpers
const STATUS_OK = 200;

function normalizeResponseBody(body: unknown): string {
  if (typeof body === "string") return body;
  if (body == null) return "";
  try {
    return JSON.stringify(body);
  } catch {
    return String(body);
  }
}

function isAcceptedResponse(status: number, bodyText: string): boolean {
  return status === STATUS_OK || bodyText.toLowerCase().includes("accepted");
}

export default function ContactSection({ className }: { className?: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // preserve reference before awaits (React pools events)
    const fd = new FormData(form);
    const data = Object.fromEntries(fd.entries());

    try {
      setIsSubmitting(true);
      const url = process.env.NEXT_PUBLIC_MAKE_URL;
      const apiKey = process.env.NEXT_PUBLIC_MAKE_API_KEY;

      // Ensure required env vars exist
      if (!(url && apiKey)) {
        toast.error("URL or APIKEY is missing or wrong");
        return;
      }

      // Proceed only if both env vars exist
      if (url && apiKey) {
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-make-apikey": apiKey,
          },
          body: JSON.stringify(data),
        });

        let responseBody: unknown = null;
        try {
          responseBody = await res.clone().json();
        } catch {
          try {
            responseBody = await res.clone().text();
          } catch {
            responseBody = null;
          }
        }

        // biome-ignore lint/suspicious/noConsole: User explicitly requested to see the response in console
        console.log("[ContactSection] Make.com response", {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          headers: Object.fromEntries(res.headers.entries()),
          body: responseBody,
        });

        const bodyText = normalizeResponseBody(responseBody);

        if (res.ok && isAcceptedResponse(res.status, bodyText)) {
          toast.success(
            "Thanks! Recieved you messages. We'll get back to you soon."
          );
          form.reset();
        } else {
          const message =
            bodyText || `Request failed (${res.status} ${res.statusText})`;
          toast.error(
            typeof message === "string" ? message : "Something went wrong."
          );
        }
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: User explicitly requested to see the error in console
      console.error("[ContactSection] Make.com request failed", error);
      toast.error("[ContactSection] Make.com request failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={clsx(
        "container mx-auto mt-20 scroll-mt-28 px-4 lg:px-8",
        className
      )}
      id="contact"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-white/30 bg-[#f5f6f6] p-6 shadow-lg backdrop-blur-xl lg:p-10">
        {/* decorative blurred blobs */}
        <Image
          alt="Ellipse 4"
          className="-bottom-8 -left-8 pointer-events-none absolute z-0 opacity-90 blur-2xl"
          height={220}
          src="/images/Ellipse 4.png"
          width={180}
        />
        <Image
          alt="Ellipse 6"
          className="-top-4 -right-2 pointer-events-none absolute z-0 opacity-90 blur-2xl"
          height={120}
          src="/images/Ellipse 6.png"
          width={120}
        />

        <div className="relative z-10 grid grid-cols-1 items-center justify-center gap-8 lg:grid-cols-3">
          {/* Left: contact info */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <EnvelopeIcon className="h-5 w-5" />
              </div>
              <div className="text-foreground">contact@scalebuild.ai</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <LocationPinIcon className="h-5 w-5" />
              </div>
              <div className="text-foreground">Manhattan, NYC</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                <PhoneFilledIcon className="h-5 w-5" />
              </div>
              <div className="text-foreground">+1 919 576 6153</div>
            </div>
          </div>

          {/* Right: form */}
          <form className="lg:col-span-2" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div>
                <label
                  className="mb-2 block font-normal text-foreground text-md"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  className="w-full rounded-none border-0 border-primary/30 border-b bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
                  id="firstName"
                  name="firstName"
                  placeholder=""
                  required
                />
              </div>
              <div>
                <label
                  className="mb-2 block font-normal text-foreground text-md"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  className="w-full rounded-none border-0 border-primary/30 border-b bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
                  id="lastName"
                  name="lastName"
                  required
                />
              </div>

              <div>
                <label
                  className="mb-2 block font-normal text-foreground text-md"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full rounded-none border-0 border-primary/30 border-b bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
                  id="email"
                  name="email"
                  required
                  type="email"
                />
              </div>
              <div>
                <label
                  className="mb-2 block font-normal text-foreground text-md"
                  htmlFor="phone"
                >
                  Phone Number
                </label>
                <input
                  className="w-full rounded-none border-0 border-primary/30 border-b bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
                  id="phone"
                  name="phone"
                  type="tel"
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  className="mb-2 block font-normal text-foreground text-md"
                  htmlFor="message"
                >
                  Message
                </label>
                <textarea
                  className="w-full resize-none rounded-none border-0 border-primary/30 border-b bg-transparent px-0 py-3 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
                  id="message"
                  name="message"
                  rows={4}
                />
              </div>
            </div>

            <div className="mt-6 flex w-full justify-end">
              <Button
                aria-busy={isSubmitting}
                className="bg-primary-500 px-6 py-3 text-primary-foreground hover:bg-primary-500/90"
                disabled={isSubmitting}
                type="submit"
              >
                <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                {!isSubmitting && <PaperPlaneIcon className="mr-2 h-5 w-5" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

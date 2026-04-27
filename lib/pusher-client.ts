"use client";

import PusherClient from "pusher-js";

let client: PusherClient | null = null;

export function getPusherClient(): PusherClient {
  if (typeof window === "undefined") {
    throw new Error("getPusherClient darf nur im Browser verwendet werden");
  }
  if (!client) {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!key || !cluster) {
      throw new Error(
        "NEXT_PUBLIC_PUSHER_KEY oder NEXT_PUBLIC_PUSHER_CLUSTER fehlt"
      );
    }
    client = new PusherClient(key, {
      cluster,
      forceTLS: true,
    });
  }
  return client;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { getPusherClient } from "./pusher-client";
import {
  PUSHER_CHANNEL,
  PUSHER_EVENTS,
  type VotePayload,
  type WorkshopState,
} from "./types";
import { INITIAL_STATE } from "./types";
import { clearVotes } from "./client-id";
import type { Channel } from "pusher-js";

const VOTES_STORAGE_KEY = "evil-ai-presenter-votes";
const STATE_STORAGE_KEY = "evil-ai-presenter-state";

export function useWorkshop({ presenter = false }: { presenter?: boolean }) {
  const [state, setState] = useState<WorkshopState>(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STATE_STORAGE_KEY);
      if (stored) {
        try { return JSON.parse(stored) as WorkshopState; } catch {}
      }
    }
    return INITIAL_STATE;
  });

  const [votes, setVotes] = useState<VotePayload[]>(() => {
    if (presenter && typeof window !== "undefined") {
      const stored = window.localStorage.getItem(VOTES_STORAGE_KEY);
      if (stored) {
        try { return JSON.parse(stored) as VotePayload[]; } catch {}
      }
    }
    return [];
  });

  // resetCount – inkrementiert bei jedem Reset, damit Play-Page reagieren kann
  const [resetCount, setResetCount] = useState(0);

  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(PUSHER_CHANNEL);
    channelRef.current = channel;

    const onState = (newState: WorkshopState) => {
      setState((prev) => {
        if (typeof newState.rev === "number" && newState.rev < prev.rev) return prev;
        return newState;
      });
      // Auch Player-Seite cached State für Reconnect
      if (!presenter && typeof window !== "undefined") {
        window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(newState));
      }
    };

    const onVote = (payload: VotePayload) => {
      setVotes((prev) => {
        const filtered = prev.filter(
          (v) => !(v.questionId === payload.questionId && v.clientId === payload.clientId)
        );
        return [...filtered, payload];
      });
    };

    const onReset = () => {
      setVotes([]);
      setResetCount((c) => c + 1);
      // Voted-Flags in LocalStorage löschen (für alle Clients)
      clearVotes();
      if (presenter && typeof window !== "undefined") {
        window.localStorage.removeItem(VOTES_STORAGE_KEY);
      }
    };

    channel.bind(PUSHER_EVENTS.STATE, onState);
    channel.bind(PUSHER_EVENTS.VOTE, onVote);
    channel.bind(PUSHER_EVENTS.RESET, onReset);

    // Reconnect bei Rückkehr aus Hintergrund (Smartphone-Fix)
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const p = getPusherClient();
        if (p.connection.state !== "connected") {
          p.connect();
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      channel.unbind(PUSHER_EVENTS.STATE, onState);
      channel.unbind(PUSHER_EVENTS.VOTE, onVote);
      channel.unbind(PUSHER_EVENTS.RESET, onReset);
      pusher.unsubscribe(PUSHER_CHANNEL);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [presenter]);

  // Persistenz Presenter
  useEffect(() => {
    if (!presenter || typeof window === "undefined") return;
    window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  }, [state, presenter]);

  useEffect(() => {
    if (!presenter || typeof window === "undefined") return;
    window.localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  }, [votes, presenter]);

  return { state, setState, votes, setVotes, resetCount };
}

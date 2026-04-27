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
import type { Channel } from "pusher-js";

const VOTES_STORAGE_KEY = "evil-ai-presenter-votes";
const STATE_STORAGE_KEY = "evil-ai-presenter-state";

/**
 * Subscribes to the workshop channel.
 * - Wenn `presenter=true`: Lädt persistierten State+Votes aus localStorage,
 *   speichert Updates dorthin (Crash-Resilience).
 * - Sonst: Hört nur passiv mit, hält State und Votes im Memory.
 */
export function useWorkshop({ presenter = false }: { presenter?: boolean }) {
  const [state, setState] = useState<WorkshopState>(() => {
    if (presenter && typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STATE_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as WorkshopState;
        } catch {}
      }
    }
    return INITIAL_STATE;
  });

  const [votes, setVotes] = useState<VotePayload[]>(() => {
    if (presenter && typeof window !== "undefined") {
      const stored = window.localStorage.getItem(VOTES_STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as VotePayload[];
        } catch {}
      }
    }
    return [];
  });

  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    const pusher = getPusherClient();
    const channel = pusher.subscribe(PUSHER_CHANNEL);
    channelRef.current = channel;

    const onState = (newState: WorkshopState) => {
      setState((prev) => {
        // rev-basiertes Tie-Breaking: ignoriere ältere Updates
        if (typeof newState.rev === "number" && newState.rev < prev.rev) {
          return prev;
        }
        return newState;
      });
    };

    const onVote = (payload: VotePayload) => {
      setVotes((prev) => {
        // Doppelte Votes desselben Clients zur selben Frage werden überschrieben
        const filtered = prev.filter(
          (v) =>
            !(v.questionId === payload.questionId && v.clientId === payload.clientId)
        );
        return [...filtered, payload];
      });
    };

    const onReset = () => {
      setVotes([]);
      if (presenter && typeof window !== "undefined") {
        window.localStorage.removeItem(VOTES_STORAGE_KEY);
      }
    };

    channel.bind(PUSHER_EVENTS.STATE, onState);
    channel.bind(PUSHER_EVENTS.VOTE, onVote);
    channel.bind(PUSHER_EVENTS.RESET, onReset);

    return () => {
      channel.unbind(PUSHER_EVENTS.STATE, onState);
      channel.unbind(PUSHER_EVENTS.VOTE, onVote);
      channel.unbind(PUSHER_EVENTS.RESET, onReset);
      pusher.unsubscribe(PUSHER_CHANNEL);
    };
  }, [presenter]);

  // Persistenz: Presenter speichert State+Votes
  useEffect(() => {
    if (!presenter || typeof window === "undefined") return;
    window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  }, [state, presenter]);

  useEffect(() => {
    if (!presenter || typeof window === "undefined") return;
    window.localStorage.setItem(VOTES_STORAGE_KEY, JSON.stringify(votes));
  }, [votes, presenter]);

  return { state, setState, votes, setVotes };
}

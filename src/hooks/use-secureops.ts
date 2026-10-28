import { useSyncExternalStore } from "react";
import { getSnapshot, subscribe } from "@/lib/secureops-data";

export function useSecureOps() {
  return useSyncExternalStore(
    (cb) => {
      const unsub = subscribe(cb);
      return () => {
        unsub();
      };
    },
    getSnapshot,
    getSnapshot,
  );
}

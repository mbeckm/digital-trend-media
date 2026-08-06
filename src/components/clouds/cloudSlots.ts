/**
 * Caps concurrent WebGL cloud contexts. M1 + Loom encode can exhaust GPU
 * memory when many canvases stay alive even if their rAF loops are paused.
 */
const MAX_TOTAL = 2;
const MAX_FULL = 1;

type SlotKind = "full" | "subtle";

type Holder = {
  id: number;
  kind: SlotKind;
  /** Drop the live canvas; optionally re-queue without waking waiters yet. */
  revoke: () => void;
};

let nextId = 1;
const holders = new Map<number, Holder>();
const waiters = new Set<() => void>();

function countByKind(kind: SlotKind) {
  let n = 0;
  for (const h of holders.values()) {
    if (h.kind === kind) n += 1;
  }
  return n;
}

/** Evict one holder of `kind`. Does not notify waiters (caller may still be acquiring). */
function revokeOne(kind: SlotKind) {
  for (const [hid, h] of holders) {
    if (h.kind === kind) {
      holders.delete(hid);
      h.revoke();
      return true;
    }
  }
  return false;
}

function notifyWaiters() {
  if (holders.size >= MAX_TOTAL || waiters.size === 0) return;
  const queue = [...waiters];
  waiters.clear();
  for (const wake of queue) wake();
}

/**
 * Request a live WebGL slot. `onGranted` mounts the canvas; `onRevoked` unmounts
 * it when a higher-priority field needs the GPU.
 * Returns a dispose function that must run on effect cleanup.
 */
export function requestCloudSlot(
  kind: SlotKind,
  onGranted: () => void,
  onRevoked: () => void,
): () => void {
  const id = nextId++;
  let armed = true;
  let holding = false;

  const drop = () => {
    if (!holding) return;
    holding = false;
    holders.delete(id);
  };

  const tryAcquire = () => {
    if (!armed || holding) return;
    waiters.delete(tryAcquire);

    if (kind === "full" && countByKind("full") >= MAX_FULL) {
      revokeOne("full");
    }

    if (holders.size >= MAX_TOTAL) {
      if (kind === "full") {
        while (holders.size >= MAX_TOTAL && revokeOne("subtle")) {
          /* keep clearing card washes for a full field */
        }
      }
      if (holders.size >= MAX_TOTAL) {
        waiters.add(tryAcquire);
        return;
      }
    }

    if (kind === "full" && countByKind("full") >= MAX_FULL) {
      waiters.add(tryAcquire);
      return;
    }

    holding = true;
    holders.set(id, {
      id,
      kind,
      revoke: () => {
        if (!armed || !holding) return;
        drop();
        onRevoked();
        // Re-queue quietly — the acquirer that evicted us still needs the slot.
        waiters.add(tryAcquire);
      },
    });
    onGranted();
  };

  tryAcquire();

  return () => {
    if (!armed) return;
    armed = false;
    waiters.delete(tryAcquire);
    if (holding) {
      drop();
      notifyWaiters();
    }
  };
}

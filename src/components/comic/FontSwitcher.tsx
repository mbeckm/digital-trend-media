"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_FONT_PAIRING,
  fontPairings,
  type FontPairingId,
} from "@/lib/fontPairings";

const STORAGE_KEY = "dtm-font-pairing";

function isPairing(value: string | null): value is FontPairingId {
  return fontPairings.some((pairing) => pairing.id === value);
}

function applyPairing(id: FontPairingId) {
  if (id === DEFAULT_FONT_PAIRING) {
    delete document.body.dataset.font;
  } else {
    document.body.dataset.font = id;
  }
}

/**
 * Review tool: lets the client compare headline/body pairings on the live
 * page. The choice lives in `?font=` so a pairing can be shared as a link.
 */
export function FontSwitcher() {
  const [active, setActive] = useState<FontPairingId>(DEFAULT_FONT_PAIRING);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("font");
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {}
    const initial = isPairing(fromUrl)
      ? fromUrl
      : isPairing(stored)
        ? stored
        : DEFAULT_FONT_PAIRING;
    applyPairing(initial);
    // Sync React state with the pairing chosen outside React (URL / storage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(initial);
  }, []);

  const choose = (id: FontPairingId) => {
    setActive(id);
    applyPairing(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {}
    const url = new URL(window.location.href);
    url.searchParams.set("font", id);
    window.history.replaceState(null, "", url);
  };

  const current = fontPairings.find((pairing) => pairing.id === active);

  return (
    <div className="font-switcher" role="group" aria-label="Schriftkombination">
      <p className="font-switcher__label">{current?.label}</p>
      <div className="font-switcher__options">
        {fontPairings.map((pairing, index) => (
          <button
            key={pairing.id}
            type="button"
            title={pairing.label}
            aria-pressed={pairing.id === active}
            className="font-switcher__option"
            onClick={() => choose(pairing.id)}
          >
            {String.fromCharCode(65 + index)}
          </button>
        ))}
      </div>
    </div>
  );
}

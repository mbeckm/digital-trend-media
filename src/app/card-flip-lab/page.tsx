"use client";

import { ScrollFlipCard } from "@/components/card-flip/ScrollFlipCard";

export default function CardFlipLabPage() {
  return (
    <main className="card-flip-lab">
      <p className="card-flip-lab__hint">
        Scroll — die Karten heben nacheinander ab und flippen
      </p>
      <ScrollFlipCard />
    </main>
  );
}

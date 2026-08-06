import {
  CauseCursor,
  CauseFailChip,
  CauseVariantShell,
} from "../CausePrimitives";

export function UnreadablePitch() {
  return (
    <CauseVariantShell>
      <div className="cause-card__eyebrow">Die Botschaft</div>
      <p className="cause-d__headline">
        <span className="cause-d__word">Wir</span>
        <span className="cause-d__word">liefern</span>
        <span className="cause-d__scramble cause-anim">
          <span className="cause-d__scramble-a">Mehrwert</span>
          <span className="cause-d__scramble-b">????</span>
        </span>
        <span className="cause-d__word">in</span>
        <span className="cause-d__word">Wochen.</span>
      </p>
      <p className="cause-d__sub">Was genau bedeutet das für mich?</p>
      <div className="cause-d__action">
        <span className="cause-cta cause-cta--dead cause-d__cta cause-anim">
          Kostenloses Gespräch
        </span>
        <CauseFailChip className="cause-d__stat">Kein Klick</CauseFailChip>
        <CauseCursor className="cause-d__cursor" />
      </div>
    </CauseVariantShell>
  );
}

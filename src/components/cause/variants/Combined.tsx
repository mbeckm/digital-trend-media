import {
  CauseCursor,
  CauseFailChip,
  CauseVariantShell,
  CauseVisitor,
} from "../CausePrimitives";

const chips = ["Schneller", "Günstiger", "Alles aus einer Hand"];

export function Combined() {
  return (
    <CauseVariantShell>
      <div className="cause-card__eyebrow">Ihr Angebot — unklar</div>
      <div className="cause-e__chips">
        {chips.map((chip) => (
          <span key={chip} className="cause-e__chip cause-anim">
            {chip}
          </span>
        ))}
      </div>
      <p className="cause-e__headline">
        <span>Wir</span>
        <span>liefern</span>
        <span className="cause-e__scramble cause-anim">
          <span className="cause-e__scramble-a">Mehrwert</span>
          <span className="cause-e__scramble-b">????</span>
        </span>
        <span>—</span>
        <span>oder?</span>
      </p>
      <div className="cause-e__action">
        <span className="cause-cta cause-cta--dead cause-e__cta cause-anim">
          Jetzt anfragen
        </span>
        <CauseFailChip className="cause-e__stat">0 Anfragen</CauseFailChip>
        <CauseCursor className="cause-e__cursor" />
      </div>
      <CauseVisitor className="cause-e__visitor" />
    </CauseVariantShell>
  );
}

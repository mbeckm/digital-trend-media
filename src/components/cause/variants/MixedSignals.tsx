import {
  CauseFailChip,
  CauseVariantShell,
  CauseVisitor,
} from "../CausePrimitives";

const chips = ["Schneller", "Günstiger", "Alles aus einer Hand"];

export function MixedSignals() {
  return (
    <CauseVariantShell>
      <div className="cause-card__eyebrow">Ihr Angebot</div>
      <div className="cause-a__chips">
        {chips.map((chip) => (
          <span key={chip} className="cause-a__chip cause-anim">
            {chip}
          </span>
        ))}
        <CauseVisitor className="cause-a__visitor" />
      </div>
      <div className="cause-a__foot">
        <span className="cause-cta cause-cta--dead">Jetzt anfragen</span>
        <CauseFailChip className="cause-a__stat">0 Anfragen</CauseFailChip>
      </div>
    </CauseVariantShell>
  );
}

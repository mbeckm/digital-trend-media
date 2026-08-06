import {
  CauseFailChip,
  CauseVariantShell,
  CauseVisitor,
} from "../CausePrimitives";

export function FoggedOffer() {
  return (
    <CauseVariantShell>
      <div className="cause-card__eyebrow">Was wir anbieten</div>
      <div className="cause-b__silhouette">
        <div className="cause-b__shape cause-anim" />
        <div className="cause-b__mist cause-anim" />
        <CauseVisitor className="cause-b__visitor" />
      </div>
      <div className="cause-b__foot">
        <span className="cause-cta cause-cta--dead">Mehr erfahren</span>
        <CauseFailChip className="cause-b__stat">Nicht verstanden</CauseFailChip>
      </div>
    </CauseVariantShell>
  );
}

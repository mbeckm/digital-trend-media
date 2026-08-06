import type { ReactNode } from "react";

/**
 * C · Unclear picture
 *
 * Messaging arrives from every direction — product, site, ads, sales,
 * word of mouth, email — and the lines themselves knot into confusion.
 * No exit. No text.
 */

type Source = {
  className: string;
  cx: number;
  cy: number;
  path: string;
  Icon: () => ReactNode;
};

function IconWebsite() {
  return (
    <g className="cause-c__icon">
      <circle className="cause-c__icon-bg" r="18" />
      <rect x="-11" y="-8" width="22" height="16" rx="2" />
      <path d="M-11 -3.5 H11" />
      <circle className="cause-c__icon-dot" cx="-7" cy="-5.5" r="1" />
      <circle className="cause-c__icon-dot" cx="-4" cy="-5.5" r="1" />
    </g>
  );
}

function IconProduct() {
  return (
    <g className="cause-c__icon">
      <circle className="cause-c__icon-bg" r="18" />
      <path d="M0 -9 L9 -4 V6 L0 11 L-9 6 V-4 Z" />
      <path d="M0 -9 V2" />
      <path d="M-9 -4 L0 2 L9 -4" />
    </g>
  );
}

function IconAds() {
  return (
    <g className="cause-c__icon">
      <circle className="cause-c__icon-bg" r="18" />
      <rect x="-10" y="-7" width="14" height="14" rx="2" />
      <path d="M5 -4 L11 -7 V7 L5 4 Z" />
    </g>
  );
}

function IconSales() {
  return (
    <g className="cause-c__icon">
      <circle className="cause-c__icon-bg" r="18" />
      <circle cx="0" cy="-5" r="3.5" />
      <path d="M-7 9 C-7 3, -4 1, 0 1 C4 1, 7 3, 7 9" />
    </g>
  );
}

function IconWordOfMouth() {
  return (
    <g className="cause-c__icon">
      <circle className="cause-c__icon-bg" r="18" />
      <path d="M-9 -2 C-9 -7, -4 -9, 0 -9 C5 -9, 9 -6, 9 -2 C9 2, 5 5, 1 5 L-2 9 L-1 5 C-5 5, -9 2, -9 -2 Z" />
    </g>
  );
}

function IconEmail() {
  return (
    <g className="cause-c__icon">
      <circle className="cause-c__icon-bg" r="18" />
      <rect x="-11" y="-7" width="22" height="14" rx="2" />
      <path d="M-11 -5 L0 2 L11 -5" />
    </g>
  );
}

const sources: Source[] = [
  {
    className: "cause-c__source--1",
    cx: 48,
    cy: 260,
    // website
    path: "M70 260 H280 C320 260 350 220 390 245 C430 270 470 210 510 245 C550 280 520 330 475 315 C430 300 410 255 445 235 C480 215 530 255 505 295 C480 335 425 320 400 285 C375 250 420 230 455 255 C490 280 470 325 435 305",
    Icon: IconWebsite,
  },
  {
    className: "cause-c__source--2",
    cx: 240,
    cy: 48,
    // product
    path: "M240 70 V175 C240 215 300 235 345 210 C390 185 440 235 480 215 C520 195 545 250 510 285 C475 320 425 270 405 300 C385 330 440 355 475 325 C510 295 490 250 455 270 C420 290 400 335 435 350 C470 365 515 330 495 295",
    Icon: IconProduct,
  },
  {
    className: "cause-c__source--3",
    cx: 720,
    cy: 48,
    // ads
    path: "M720 70 V175 C720 215 660 235 615 210 C570 185 520 235 480 215 C440 195 415 250 450 285 C485 320 535 270 555 300 C575 330 520 355 485 325 C450 295 470 250 505 270 C540 290 560 335 525 350 C490 365 445 330 465 295",
    Icon: IconAds,
  },
  {
    className: "cause-c__source--4",
    cx: 912,
    cy: 260,
    // sales
    path: "M890 260 H680 C640 260 610 220 570 245 C530 270 490 210 450 245 C410 280 440 330 485 315 C530 300 550 255 515 235 C480 215 430 255 455 295 C480 335 535 320 560 285 C585 250 540 230 505 255 C470 280 490 325 525 305",
    Icon: IconSales,
  },
  {
    className: "cause-c__source--5",
    cx: 720,
    cy: 472,
    // word of mouth
    path: "M720 450 V345 C720 305 660 285 615 310 C570 335 520 285 480 305 C440 325 415 270 450 235 C485 200 535 250 555 220 C575 190 520 165 485 195 C450 225 470 270 505 250 C540 230 560 185 525 170 C490 155 445 190 465 225",
    Icon: IconWordOfMouth,
  },
  {
    className: "cause-c__source--6",
    cx: 240,
    cy: 472,
    // email
    path: "M240 450 V345 C240 305 300 285 345 310 C390 335 440 285 480 305 C520 325 545 270 510 235 C475 200 425 250 405 220 C385 190 440 165 475 195 C510 225 490 270 455 250 C420 230 400 185 435 170 C470 155 515 190 495 225",
    Icon: IconEmail,
  },
];

export function DecisionParalysis() {
  return (
    <div className="cause-c cause-enter cause-anim">
      <svg
        className="cause-c__diagram"
        viewBox="0 0 960 520"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        {sources.map(({ className, cx, cy, path, Icon }) => (
          <g key={className} className={`cause-c__source ${className} cause-anim`}>
            <g transform={`translate(${cx} ${cy})`}>
              <Icon />
            </g>
            <path pathLength={1} d={path} />
          </g>
        ))}
      </svg>
    </div>
  );
}

"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
} from "motion/react";
import type { ReactNode } from "react";

/** Emil / design-eng ease-out — presence first, soft settle. */
export const easeOut = [0.23, 1, 0.32, 1] as const;

export const revealTransition = {
  duration: 0.78,
  ease: easeOut,
};

export const revealStagger = 0.09;

const viewport = { once: true, margin: "-8% 0px -8% 0px", amount: 0.05 as const };

export const revealItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const revealSoft = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  soft?: boolean;
} & Omit<HTMLMotionProps<"div">, "children" | "initial" | "whileInView" | "animate">;

/** Single block that fades up + soft-blurs into view on scroll. */
export function Reveal({
  children,
  className,
  delay = 0,
  soft = false,
  ...rest
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const variants = soft ? revealSoft : revealItem;

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
      transition={{ ...revealTransition, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type RevealGroupProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
};

/** Parent that staggers RevealItem children into view. */
export function RevealGroup({
  children,
  className,
  stagger = revealStagger,
  delayChildren = 0.04,
}: RevealGroupProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

type RevealItemProps = {
  children: ReactNode;
  className?: string;
  soft?: boolean;
  as?: "div" | "h2" | "h3" | "p" | "header" | "article" | "li";
};

/** Child of RevealGroup — inherits stagger. */
export function RevealItem({
  children,
  className,
  soft = false,
  as = "div",
}: RevealItemProps) {
  const reduceMotion = useReducedMotion();
  const variants = soft ? revealSoft : revealItem;
  const Comp = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Comp
      className={className}
      variants={variants}
      transition={revealTransition}
    >
      {children}
    </Comp>
  );
}

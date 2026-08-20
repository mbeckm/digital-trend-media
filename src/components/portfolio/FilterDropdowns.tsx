"use client";

import { ChevronDown, Trash2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

import {
  type FilterGroup,
  type FilterState,
  filterGroups,
  filterValue,
} from "@/components/portfolio/data";

const dockSpring = { type: "spring" as const, duration: 0.4, bounce: 0.1 };
const dockExit = { duration: 0.18, ease: [0.4, 0, 1, 1] as const };

function FilterDropdown({
  group,
  value,
  onChange,
  dropUp = false,
}: {
  group: FilterGroup;
  value: string | null;
  onChange: (next: string | null) => void;
  dropUp?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const options = filterGroups[group];

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={`group flex w-full items-center justify-between gap-2 rounded-full px-3.5 py-2.5 text-left transition-[background-color,color,transform] active:scale-[0.985] sm:px-4 sm:py-3 ${
          value
            ? "bg-[#132c55] text-white"
            : "bg-black/[0.04] text-black hover:bg-black/[0.07]"
        }`}
      >
        <span className="min-w-0">
          <span
            className={`block font-[family-name:var(--font-inter)] text-[10px] font-medium leading-none tracking-[0.06em] ${
              value ? "text-white/65" : "text-black/40"
            }`}
          >
            {group}
          </span>
          <span
            className={`mt-1 block truncate font-[family-name:var(--font-inter-tight)] text-[15px] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[16px] ${
              value ? "text-white" : "text-black"
            }`}
          >
            {value ?? "Alle"}
          </span>
        </span>
        <ChevronDown
          className={`size-4 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${value ? "text-white/55" : "text-black/35"}`}
          strokeWidth={2}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{
              opacity: 0,
              y: dropUp ? 8 : -8,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: dropUp ? 6 : -6,
            }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className={`absolute z-50 max-h-64 w-full min-w-[11rem] overflow-auto rounded-2xl bg-white p-1.5 smooth-shadow-ring-lg shadow-[#0c1a3a] ${
              dropUp
                ? "bottom-[calc(100%+10px)] left-0"
                : "left-0 top-[calc(100%+10px)]"
            }`}
          >
            <li role="option" aria-selected={value === null}>
              <button
                type="button"
                className={`flex w-full rounded-xl px-3 py-2.5 text-left font-[family-name:var(--font-inter-tight)] text-[14px] font-medium tracking-[-0.01em] transition-colors ${
                  value === null
                    ? "bg-[#eaf2ff] text-[#132c55]"
                    : "text-black/75 hover:bg-black/[0.04]"
                }`}
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
              >
                Alle
              </button>
            </li>
            {options.map((option) => {
              const selected = value === option;
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={`flex w-full rounded-xl px-3 py-2.5 text-left font-[family-name:var(--font-inter-tight)] text-[14px] font-medium tracking-[-0.01em] transition-colors ${
                      selected
                        ? "bg-[#eaf2ff] text-[#132c55]"
                        : "text-black/75 hover:bg-black/[0.04]"
                    }`}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                  >
                    {option}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/**
 * Bottom dock pill: three equal filters fill the width while the section is in view.
 */
export function FilterDockPill({
  active,
  onChange,
  onReset,
  onSkipToEnd,
  resultCount,
  visible,
}: {
  active: FilterState;
  onChange: (group: FilterGroup, value: string | null) => void;
  onReset: () => void;
  onSkipToEnd: () => void;
  resultCount: number;
  visible: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const hasActive = active !== null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="filter-dock"
          role="toolbar"
          aria-label="Portfolio-Filter"
          initial={
            reduceMotion ? false : { opacity: 0, y: 28, scale: 0.96 }
          }
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: reduceMotion ? { duration: 0.12 } : dockSpring,
          }}
          exit={{
            opacity: 0,
            y: 14,
            scale: 0.98,
            transition: reduceMotion ? { duration: 0.1 } : dockExit,
          }}
          className="pointer-events-auto fixed bottom-5 left-1/2 z-40 w-[min(100%-1.25rem,40rem)] -translate-x-1/2 sm:bottom-7"
        >
          <div className="rounded-[1.75rem] bg-white/80 p-2.5 smooth-shadow-ring-xl shadow-[#0c1a3a] backdrop-blur-xl sm:rounded-[2rem] sm:p-3">
            <div
              className={`grid items-stretch gap-1 sm:gap-1.5 ${
                hasActive
                  ? "grid-cols-[1fr_1fr_1fr_auto]"
                  : "grid-cols-3"
              }`}
            >
              {(Object.keys(filterGroups) as FilterGroup[]).map((group) => (
                <FilterDropdown
                  key={group}
                  group={group}
                  value={filterValue(active, group)}
                  dropUp
                  onChange={(value) => onChange(group, value)}
                />
              ))}

              {hasActive ? (
                <button
                  type="button"
                  onClick={onReset}
                  aria-label="Filter zurücksetzen"
                  className="flex aspect-square size-[51px] items-center justify-center self-stretch rounded-full text-black/45 transition-colors hover:bg-black/[0.05] hover:text-black active:scale-[0.97] sm:size-auto sm:min-w-[52px] sm:px-3"
                >
                  <Trash2 className="size-[18px]" strokeWidth={1.75} />
                </button>
              ) : null}
            </div>

            <button
              type="button"
              onClick={onSkipToEnd}
              className="mx-auto mt-2 block w-full rounded-full px-2 py-1 text-center font-[family-name:var(--font-inter)] text-[12px] font-medium tracking-[-0.01em] text-black/40 transition-colors hover:bg-black/[0.03] hover:text-black/65 active:scale-[0.99] sm:mt-2.5 sm:py-0.5"
            >
              Zum Ende springen
            </button>

            <p className="sr-only" aria-live="polite">
              {resultCount} {resultCount === 1 ? "Film" : "Filme"}
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

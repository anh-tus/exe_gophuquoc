'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { CaretDown, Check } from '@phosphor-icons/react';

type Option = { value: string; label: string };

type Props = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  compact?: boolean;
  className?: string;
};

export default function SelectMenu({ label, value, options, onChange, compact = false, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const selected = options[selectedIndex];
  const hasFilter = value !== 'all' && value !== 'popular';

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnFocusOutside = (event: FocusEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOnFocusOutside);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOnFocusOutside);
    };
  }, [open]);

  const focusOption = (index: number) => {
    requestAnimationFrame(() => optionRefs.current[Math.max(0, Math.min(index, options.length - 1))]?.focus());
  };
  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        aria-label={`${label}: ${selected?.label ?? ''}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-options` : undefined}
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpen(true);
            focusOption(event.key === 'ArrowDown' ? selectedIndex : Math.max(0, selectedIndex - 1));
          }
          if (event.key === 'Escape') setOpen(false);
        }}
        title={selected?.label}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 text-left text-gray-900 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#087f78] ${compact ? 'min-h-11 text-xs font-bold' : 'min-h-14'} ${open ? 'border-[#087f78] ring-2 ring-emerald-100' : hasFilter ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}
      >
        <span className="min-w-0">
          {!compact && <span className="block text-xs font-medium text-gray-500">{label}</span>}
          <span className="block truncate text-sm font-bold">{selected?.label}</span>
        </span>
        <CaretDown size={16} className={`shrink-0 text-[#087f78] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={`${id}-options`} role="listbox" aria-label={label} className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_16px_40px_rgba(6,78,67,0.16)]">
          {options.map((option, index) => (
            <button
              key={option.value}
              ref={(node) => { optionRefs.current[index] = node; }}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => choose(option.value)}
              onKeyDown={(event) => {
                if (event.key === 'Escape') { event.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
                if (event.key === 'ArrowDown') { event.preventDefault(); focusOption((index + 1) % options.length); }
                if (event.key === 'ArrowUp') { event.preventDefault(); focusOption((index - 1 + options.length) % options.length); }
                if (event.key === 'Home') { event.preventDefault(); focusOption(0); }
                if (event.key === 'End') { event.preventDefault(); focusOption(options.length - 1); }
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-[#087f78] ${option.value === value ? 'bg-emerald-50 font-bold text-[#087f78]' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={16} weight="bold" className="shrink-0" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

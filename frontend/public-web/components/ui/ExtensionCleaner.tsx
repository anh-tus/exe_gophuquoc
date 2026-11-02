'use client';

import { useEffect } from 'react';

/**
 * Removes the 'bis_skin_checked' attribute injected by browser extensions
 * (Dark Reader, Grammarly, etc.) that causes React hydration mismatches.
 * Runs after hydration via useEffect so it never affects SSR output.
 */
export default function ExtensionCleaner() {
  useEffect(() => {
    // 1. Clean existing
    document.querySelectorAll('[bis_skin_checked]').forEach((el) => {
      el.removeAttribute('bis_skin_checked');
    });

    // 2. Watch for late injections
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (
          m.type === 'attributes' &&
          m.attributeName === 'bis_skin_checked'
        ) {
          (m.target as Element).removeAttribute('bis_skin_checked');
        }
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              (node as Element)
                .querySelectorAll?.('[bis_skin_checked]')
                .forEach((el) => el.removeAttribute('bis_skin_checked'));
              if ((node as Element).hasAttribute?.('bis_skin_checked')) {
                (node as Element).removeAttribute('bis_skin_checked');
              }
            }
          });
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      subtree: true,
      attributeFilter: ['bis_skin_checked'],
      childList: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}

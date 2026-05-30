import { useEffect } from 'react';

const protectedSelector = '[data-protected-photo]';

const isProtectedTarget = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest(protectedSelector));

export function usePhotoProtection() {
  useEffect(() => {
    const protect = (event: Event) => {
      if (!isProtectedTarget(event.target)) return;
      event.preventDefault();
    };

    const events: (keyof DocumentEventMap)[] = ['contextmenu', 'copy', 'cut', 'dragstart', 'drop'];

    events.forEach((eventName) => {
      document.addEventListener(eventName, protect, { capture: true });
    });

    return () => {
      events.forEach((eventName) => {
        document.removeEventListener(eventName, protect, { capture: true });
      });
    };
  }, []);
}

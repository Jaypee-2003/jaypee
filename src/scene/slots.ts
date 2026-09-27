import { StopId } from '../site/stops';

// One DOM slot per stop, created in route order by SceneSite before the canvas mounts. Placards portal
// into their stop's slot, so the DOM order (and therefore tab order and reading order) follows the route
// no matter when each placard happens to mount.
const slots = new Map<StopId, HTMLElement>();

export const registerSlot = (id: StopId, el: HTMLElement | null): void => {
  if (el) slots.set(id, el);
  else slots.delete(id);
};

export const slotFor = (id: StopId): HTMLElement | null => slots.get(id) ?? null;

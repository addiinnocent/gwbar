import type { PointerEvent as ReactPointerEvent } from 'react';
import { PointerSensor } from '@dnd-kit/core';

/**
 * PointerSensor restricted to real mice. Pointer events also fire for touch,
 * and this sensor would otherwise win the activation race against the
 * TouchSensor — only for the browser to hijack the gesture (pointercancel)
 * as soon as the finger pans, cancelling every mobile drag.
 */
export class MouseSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown' as const,
      handler: ({ nativeEvent: event }: ReactPointerEvent) =>
        event.pointerType === 'mouse',
    },
  ];
}

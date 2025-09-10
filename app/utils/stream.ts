// Simple client-side pub/sub for real-time-ish updates across tabs/components
// Uses BroadcastChannel when available, falls back to window events.

export type StreamEvent = {
  type: 'courses:updated' | 'resources:updated' | 'quizzes:updated' | 'assignments:updated';
  payload?: any;
};

const CHANNEL_NAME = 'lms-stream';

let channel: BroadcastChannel | null = null;
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
  channel = new BroadcastChannel(CHANNEL_NAME);
}

export function publish(event: StreamEvent) {
  try {
    if (channel) {
      channel.postMessage(event);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(CHANNEL_NAME, { detail: event }));
    }
  } catch (e) {
    // no-op
  }
}

export function subscribe(handler: (e: StreamEvent) => void): () => void {
  const onMsg = (e: MessageEvent | Event) => {
    // BroadcastChannel
    if ('data' in (e as any)) {
      handler((e as MessageEvent).data as StreamEvent);
      return;
    }
    // window event fallback
    const ce = e as CustomEvent<StreamEvent>;
    if (ce.detail) handler(ce.detail);
  };

  if (channel) {
    channel.addEventListener('message', onMsg as any);
    return () => channel?.removeEventListener('message', onMsg as any);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener(CHANNEL_NAME, onMsg as any);
    return () => window.removeEventListener(CHANNEL_NAME, onMsg as any);
  }
  return () => {};
}


"use client";

import { create } from "zustand";
import { SandboxStatus } from "./util";

let last: string | null = null;

export const useSandbox = create((set, get: () => any) => ({
  status: SandboxStatus.Idle,
  current: 0,
  code: '',
  logs: [],
  error: null,
  worker: null,
  ready: false,
  createWorker() {
    const worker = new Worker(new URL('../../workers/index', import.meta.url));

    worker.onmessage = (event) => {
      if (Array.isArray(event.data)) {
        switch (event.data[0]) {
          case 'logs':
            set(() => ({ logs: event.data[1], status: SandboxStatus.Idle, error: null }));
            break;
          case 'status':
            set(() => ({ status: event.data[1] }));
            break;
          case 'error':
            set(() => ({
              error: event.data[1]
            }));
            break;
          case 'ready':
            set(() => ({
              ready: true
            }));
            break;
        }

        if (last !== null) {
          get().worker.postMessage(['run', last]);
          last = null;
        }
      }
    };

    set(() => ({ worker }));
  },
  terminateWorker() {
    if (get().worker) {
      get().worker.terminate();
    }
  },
  runCode(value: string) {
    if (get().status === SandboxStatus.Idle && get().ready) {
      get().worker.postMessage(['run', value]);
    } else {
      last = value;
    }
  }
}));
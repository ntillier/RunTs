import { create } from "zustand";
import localforage from "localforage";
import { nanoid } from "nanoid";
import { snippets } from "@codemirror/lang-javascript";
import { Keys } from "../constants";

export const useSnippets = create((set, get: () => any) => ({
  snippets: [],
  titles: new Map<string, string>(),
  codes: new Map<string, string>(),
  current: null,
  async populateSnippets() {
    const snippets: string[] = [];
    const titles = new Map<string, string>();
    const codes = new Map<string, string>();

    localforage
      .iterate((data: any, key: string) => {
        try {
          if (typeof data === 'object' && typeof data.title === 'string' && typeof data.code === 'string') {
            snippets.push(key);
            titles.set(key, data.title);
            codes.set(key, data.code);
          }
        } catch (_) {
          console.warn('Unable to parse snippet ' + key);
        }
      })
      .then(async () => {
        let current: any;

        if (titles.size === 0) {
          const id: string = nanoid();

          current = id;

          titles.set(id, 'New snippet');
          codes.set(id, 'console.log("Hello world!")');
          snippets.push(id);

          await localforage.setItem(id, { code: codes.get(id), title: titles.get(id) });
        } else {
          const saved: string | null = localStorage.getItem(Keys.Current);
          if (saved && snippets.includes(saved)) {
            current = saved;
          } else {
            current = snippets[0];
            localStorage.setItem(Keys.Current, current);
          }
        }

        set(() => ({ snippets, codes, titles, current }));
      });
  },
  showSnippet(id: string) {
    if (typeof id === 'string' && id.length === 21 && get().snippets.includes(id)) {
      set(() => ({ current: id }));
    }
  },
  async addSnippet() {
    while (true) {
      const id: string = nanoid();

      if (!get().snippets.includes(id)) {

        const title = 'New snippet';
        const code = '';

        await localforage.setItem(id, { code, title });

        set((state: any) => {
          state.titles.set(id, title);
          state.codes.set(id, code);
          state.snippets.push(id);

          return {
            snippets: state.snippets,
            codes: state.codes,
            titles: state.titles,
            current: id
          }
        });
        break;
      }
    }
  },
  async updateSnippetTitle(id: string, title: string) {
    if (typeof id === 'string' && id.length === 21 && get().snippets.includes(id)) {      

      await localforage.setItem(id, {
        title: title,
        code: get().codes.get(id)
      });

      set((state: any) => {
        state.titles.set(id, title);

        return {
          titles: state.titles
        }
      });
    }
  },
  async updateSnippetCode (id: string, code: string) {
    if (typeof id === 'string' && id.length === 21 && get().snippets.includes(id)) {      

      await localforage.setItem(id, {
        title: get().titles.get(id),
        code: code
      });

      set((state: any) => {
        state.codes.set(id, code);

        return {
          codes: state.codes
        }
      });
    }
  },
  async removeSnippet(id: string) {
    if (typeof id === 'string' && id.length === 21 && get().snippets.includes(id)) {
      await localforage.removeItem(id);

      set((state: any) => {

        state.titles.delete(id);
        state.codes.delete(id);

        state.snippets = state.snippets.filter((i: string) => i !== id);
        

        if (state.current === id) {
          state.current = state.snippets[0];
        }

        return {
          snippets: state.snippets,
          codes: state.codes,
          titles: state.titles,
          current: state.current
        };
      });

      document.body.click();
    }
  }
}));


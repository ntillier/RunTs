'use client';

import { create } from "zustand";
import { draculaColors, draculaConfig } from "../themes/dracula";
import { Keys } from "../constants";
import { abcdefColors, abcdefConfig } from "../themes/abcdef";
import { androidStudioColors, androidStudioConfig } from "../themes/androidstudio";

export type EditorPreferences = {
  showLineNumbers: boolean;
  indentOnInput: boolean;
  bracketMatching: boolean;
  closeBrackets: boolean;
  autoCompletion: boolean;
  highlightActiveLine: boolean;
  highlightSelectionMatches: boolean;
  foldGutter: boolean;
  allowMultipleSelections: boolean;
};

const themes = new Map();

themes.set('dracula', {
  config: draculaConfig,
  colors: draculaColors
});

themes.set('abcdef', {
  config: abcdefConfig,
  colors: abcdefColors
});

themes.set('androidstudio', {
  config: androidStudioConfig,
  colors: androidStudioColors
});

function editCSS(theme: any) {
  const root = document.documentElement;

  root.style.setProperty('--background', theme.colors.Background);
  root.style.setProperty('--foreground', theme.colors.Foreground);
  root.style.setProperty('--selection', theme.colors.Selection);
}

export const usePreferences = create((set, get: () => any) => ({
  themeName: 'dracula',
  themeColors: themes.get('dracula').colors,
  themeConfig: themes.get('dracula').config,

  editor: {
    showLineNumbers: true,
    indentOnInput: true,
    bracketMatching: true,
    closeBrackets: true,
    autoCompletion: true,
    highlightActiveLine: true,
    highlightSelectionMatches: true,
    foldGutter: true,
    allowMultipleSelections: false
  } as EditorPreferences,

  initTheme() {
    const saved: string | null = localStorage.getItem(Keys.Theme);

    if (themes.has(saved)) {
      const t = themes.get(saved);

      set(() => ({
        themeName: saved,
        themeColors: t.colors,
        themeConfig: t.config
      }));

      editCSS(t);
    } else {
      localStorage.setItem(Keys.Theme, get().themeName);
    }

    const prefs: string | null = localStorage.getItem(Keys.EditorPreferences);

    if (prefs) {
      try {
        set(() => ({ editor: JSON.parse(prefs) }));
      } catch (err: any) {}
    }
  },
  setTheme(name: string) {
    if (themes.has(name)) {
      set(() => ({
        themeName: name,
        themeColors: themes.get(name).colors,
        themesConfig: themes.get(name).config
      }));
      editCSS(themes.get(name));
      localStorage.setItem(Keys.Theme, name);
    }
  },
  editEditorPreferences (prefs: EditorPreferences) {
    localStorage.setItem(Keys.EditorPreferences, JSON.stringify(prefs));
    set(() => ({ editor: prefs }));
  }

}));

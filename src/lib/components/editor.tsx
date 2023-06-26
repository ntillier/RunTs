/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import CodeMirror, { Statistics } from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorView } from "@codemirror/view";
import { useSandbox } from '@/lib/services/sandbox';
import { useEffect, useMemo, useState } from 'react';
import { useSnippets } from '@/lib/services/snippets';
import { EditorPreferences, usePreferences } from '@/lib/services/preferences';
import createTheme from '@uiw/codemirror-themes';

const fontSize = EditorView.baseTheme({
  "&": {
    fontSize: "14px"
  },
});


export default function CodeEditor() {
  const [statistics, setStatistics] = useState<Statistics>();
  const onChange = useSandbox((state: any) => state.runCode);

  const currentId: string = useSnippets((state) => state.current);
  const currentCode: string = useSnippets((state) => state.codes.get(state.current));
  const updateSnippetCode = useSnippets((state) => state.updateSnippetCode);

  const themeConfig = usePreferences((state) => state.themeConfig);
  const editorPreferences: EditorPreferences = usePreferences((state) => state.editor);

  function updateCallback(stats: Statistics) {
    setStatistics(stats);
  }

  useEffect(() => {
    if (currentCode) {
      onChange(currentCode);
    }
  }, [currentCode]);

  function editorChangeEvent (value: string) {
    onChange(value);
    updateSnippetCode(currentId, value);
  }

  const editor = useMemo((): JSX.Element => {
    return <CodeMirror
      basicSetup={{
        lineNumbers: editorPreferences.showLineNumbers,
        highlightActiveLineGutter: editorPreferences.highlightActiveLine,
        foldGutter: editorPreferences.foldGutter,
        // dropCursor?: boolean;
        // allowMultipleSelections?: boolean;
        indentOnInput: editorPreferences.indentOnInput,
        bracketMatching: editorPreferences.bracketMatching,
        closeBrackets: editorPreferences.closeBrackets,
        autocompletion: editorPreferences.autoCompletion,
        // rectangularSelection?: boolean;
        // crosshairCursor?: boolean;
        highlightActiveLine: editorPreferences.highlightActiveLine,
        highlightSelectionMatches: editorPreferences.highlightSelectionMatches,
        // closeBracketsKeymap?: boolean;
        // searchKeymap?: boolean;
        // foldKeymap?: boolean;
        // completionKeymap?: boolean;
        // lintKeymap?: boolean;
        tabSize: 2,
      }}
      value={currentCode}
      editable={Boolean(currentId)}
      onChange={editorChangeEvent}
      onStatistics={updateCallback}
      height="100%"
      className='w-full h-full cm-s-dracula'
      theme={createTheme(themeConfig)}
      extensions={[fontSize, EditorView.lineWrapping, javascript({ typescript: true })]}

    />
  }, [currentId, themeConfig, editorPreferences]);

  return (
    <div className='flex flex-col h-full w-full bg-background text-foreground'>
      <div className='w-full h-0 flex-1'>
        {editor}
      </div>
      <div className='flex flex-row flex-none h-auto justify-end py-1 px-2 border-t-[1px] border-selection'>
        <label className='cursor-default text-xs'>Ln {statistics?.line?.number}, Col {Math.max((statistics?.selectionAsSingle.to ?? 0) - (statistics?.line.from ?? 0), 0)} {statistics?.selectedText && `(${statistics?.selectionCode.length} chars)`}</label>
      </div>
    </div>
  )
}
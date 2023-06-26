'use client';

import { EditorPreferences, usePreferences } from "@/lib/services/preferences";
import { useRouter } from "next/navigation";
import { useState } from "react";

function ToogleSwitch({ disabled, checked, onChange = () => { } }: { checked?: boolean, disabled?: boolean, onChange?: (value: any) => void }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input onChange={(e: any) => onChange(e.target.checked)} disabled={disabled} defaultChecked={checked} type="checkbox" className="sr-only peer" />
      <div className="w-11 h-6 bg-selection rounded-full peer peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-400"></div>
    </label>
  );
}

function RangeSelector({ step, value, min, max, label, disabled, onChange = () => { }, unit = '' }: { step: number, value?: number, min: number, max: number, label: string, onChange?: (value: number) => void, unit?: string, disabled?: boolean }) {
  const [val, setVal] = useState(value);

  const changeCallback = (e: any) => {
    setVal(e.target.value);
    onChange(e.target.value);
  }

  return (
    <div className="flex flex-row justify-end items-center py-3 px-4 gap-4">
      <label className="mr-auto">{label}</label>
      <input disabled={disabled} type="range" onChange={changeCallback} min={min} max={max} defaultValue={value} step={step} className="w-full max-w-xs flex-1 h-2 bg-selection rounded-lg appearance-none cursor-pointer opacity-100 disabled:opacity-50" />
      <span>{`${val}${unit}`}</span>
    </div>
  );
}

function SettingsItem({ checked, disabled, onChange, label }: { checked?: boolean, disabled?: boolean, onChange?: (value: any) => void, label: string }) {
  return (
    <div className="flex flex-row justify-between items-center py-3 px-4">
      <label>{label}</label>
      <ToogleSwitch onChange={onChange} checked={checked} disabled={disabled} />
    </div>
  );
}

export default function Settings() {
  const router = useRouter();

  const editor = usePreferences((state) => state.editor);
  const editEditor = usePreferences((state) => state.editEditorPreferences);

  const handleEditorChange = (key: string) => {
    return (val: any) => {
      editor[key] = val;
      editEditor(editor);
    }
  }

  return (
    <div className='fixed left-0 top-0 w-screen h-screen flex flex-row justify-center px-2 py-6 bg-background text-foreground overflow-y-auto'>
      <div className="flex flex-col w-full" style={{ maxWidth: '700px' }}>
        <label onClick={() => router.push('/')} className="flex flex-row cursor-pointer items-center text-base gap-2 rounded-lg bg-selection w-max px-2 py-1 hover:brightness-90">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
          </svg>
          Back to snippets
        </label>
        <h2 className="text-xl font-bold py-4 text-center mb-5">Settings</h2>

        <h3 className="text-base mt-5 mb-2 font-semibold">Editor</h3>
        <SettingsItem onChange={handleEditorChange('showLineNumbers')} checked={editor.showLineNumbers} label="Show line numbers" />
        <SettingsItem onChange={handleEditorChange('indentOnInput')} checked={editor.indentOnInput} label="Indent on input" />
        <SettingsItem onChange={handleEditorChange('bracketMatching')} checked={editor.bracketMatching} label="Bracket matching" />
        <SettingsItem onChange={handleEditorChange('closeBrackets')} checked={editor.closeBrackets} label="Close brackets" />
        <SettingsItem onChange={handleEditorChange('autoCompletion')} checked={editor.autoCompletion} label="Auto completion" />
        <SettingsItem onChange={handleEditorChange('highlightActiveLine')} checked={editor.highlightActiveLine} label="Highlight active line" />
        <SettingsItem onChange={handleEditorChange('highlightSelectionMatches')} checked={editor.highlightSelectionMatches} label="Highlight selection matches" />
        <SettingsItem onChange={handleEditorChange('foldGutter')} checked={editor.foldGutter} label="Fold gutter" />
        <SettingsItem onChange={handleEditorChange('allowMultipleSelections')} checked={editor.allowMultipleSelections} label="Allow multiple selections" />
      </div>
    </div>
  );
}

/*
const [global, setGlobal] = useState<Record<string, any>>({
    autoRefresh: true,
    allowRegExp: true,
    regExpTimeout: 1000
  });

  const handleGlobalChange = (key: string) => {
    return (val: any) => {
      setGlobal((state: Record<string, any>) => {
        state[key] = val;
        return { ...state };
      });
    };
  }
  
<h3 className="text-base mt-5 mb-2 font-semibold">Global</h3>
        <SettingsItem checked={true} onChange={handleGlobalChange('autoRefresh')} label="Auto Refresh" />
        <SettingsItem checked={true} onChange={handleGlobalChange('allowRegExp')} label="Allow RegExp" />
        <RangeSelector value={global.regExpTimeout} onChange={handleGlobalChange('regExpTimeout')} step={100} min={100} max={10000} disabled={!global.allowRegExp} label="RegExp timeout" unit="ms" />
*/
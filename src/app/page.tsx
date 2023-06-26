"use client";

import CodeEditor from '@/lib/components/editor';
import Tabs from '@/lib/components/tabs';
import Sandbox from '@/lib/components/sandbox';
import Splitter, { SplitDirection } from '@devbookhq/splitter'
import { useEffect, useState } from 'react';
import { useSandbox } from '@/lib/services/sandbox';
import { useSnippets } from '@/lib/services/snippets';
import { usePreferences } from '@/lib/services/preferences';
import { Keys } from '@/lib/services/constants';


export default function Home() {
  const createWorker = useSandbox((state) => state.createWorker);
  const terminateWorker = useSandbox((state) => state.terminateWorker);
  const populateSnippets = useSnippets((state) => state.populateSnippets);
  const initTheme = usePreferences((state) => state.initTheme);

  const [sizes, setSizes] = useState<number[]>([50, 50]);

  function updateResize(_: any, sizes: number[]) {
    localStorage.setItem(Keys.EditorSize, sizes[0].toFixed(0));
  }

  useEffect(() => {
    createWorker();
    populateSnippets();
    initTheme();

    const saved = parseInt(localStorage.getItem(Keys.EditorSize) ?? '', 10);

    if (saved) {
      const val = Math.min(Math.max(saved, 0), 100);
      setSizes([val, 100 - val]);
    } else {
      setSizes([50, 50]);
    }

    return () => {
      terminateWorker();
    }
  }, [createWorker, initTheme, populateSnippets, terminateWorker]);

  return (
    <div className='fixed left-0 top-0 w-screen h-screen flex flex-col bg-background'>
      <Tabs />
      <div className='flex-1 w-full h-0'>
        <Splitter
          onResizeFinished={updateResize}
          direction={SplitDirection.Horizontal}
          minWidths={[200, 200]}
          minHeights={[200, 200]}
          initialSizes={sizes}
        >
          <div className='h-full flex-1'>
            <CodeEditor />
          </div>
          <div className='h-full flex-1'>
            <Sandbox />
          </div>
        </Splitter>
      </div>
    </div>
  )
}

import { SandboxStatus } from "@/lib/services/sandbox/util";
import { Console } from "console-feed";
import { useEffect, useMemo, useState } from "react";
import { useSandbox } from "../services/sandbox";

const statusSentences = [
  'Parsing the code...',
  'Running the code...',
  'Done.'
];

export default function Sandbox() {
  const ready = useSandbox((state) => state.ready);
  const logs = useSandbox((state: any) => state.logs);
  const status = useSandbox((state: any) => state.status);
  const error = useSandbox((state: any) => state.error);
  const [key, setKey] = useState<number>(0);

  const console = useMemo(() => {
    return (
      <Console
        key={key}
        logs={logs}
        variant="dark"
        styles={{
          // LOG_COLOR: 'white',
          LOG_BACKGROUND: 'transparent',

          // LOG_INFO_COLOR: 'white',
          LOG_INFO_BACKGROUND: 'transparent',

          // LOG_COMMAND_COLOR: 'white',
          LOG_COMMAND_BACKGROUND: 'transparent',

          // LOG_RESULT_COLOR: 'white',
          LOG_RESULT_BACKGROUND: 'transparent',

          // LOG_WARN_COLOR: 'white',
          LOG_WARN_BACKGROUND: 'transparent',

          // LOG_ERROR_COLOR: 'white',
          LOG_ERROR_BACKGROUND: 'transparent',

          BASE_BACKGROUND_COLOR: 'transparent',
          // BASE_COLOR: 'white',

          TABLE_TH_BACKGROUND_COLOR: 'transparent',

          /* OBJECT_NAME_COLOR?: any
            OBJECT_VALUE_NULL_COLOR?: any
            OBJECT_VALUE_UNDEFINED_COLOR?: any
            OBJECT_VALUE_REGEXP_COLOR?: any
            OBJECT_VALUE_STRING_COLOR?: any
            OBJECT_VALUE_SYMBOL_COLOR?: any
            OBJECT_VALUE_NUMBER_COLOR?: any
            OBJECT_VALUE_BOOLEAN_COLOR?: any
            OBJECT_VALUE_FUNCTION_KEYWORD_COLOR?: any

          HTML_TAG_COLOR?: any
          HTML_TAGNAME_COLOR?: any
          HTML_TAGNAME_TEXT_TRANSFORM?: any
          HTML_ATTRIBUTE_NAME_COLOR?: any
          HTML_ATTRIBUTE_VALUE_COLOR?: any
          HTML_COMMENT_COLOR?: any
          HTML_DOCTYPE_COLOR?: any

          ARROW_COLOR?: any
          ARROW_MARGIN_RIGHT?: any
          ARROW_FONT_SIZE?: any

          TREENODE_FONT_FAMILY?: any
          TREENODE_FONT_SIZE?: any
          TREENODE_LINE_HEIGHT?: any
          TREENODE_PADDING_LEFT?: any

          TABLE_BORDER_COLOR?: any
          TABLE_TH_BACKGROUND_COLOR?: any
          TABLE_TH_HOVER_COLOR?: any
          TABLE_SORT_ICON_COLOR?: any
          TABLE_DATA_BACKGROUND_IMAGE?: any
          TABLE_DATA_BACKGROUND_SIZE?: any*/

          BASE_FONT_FAMILY: "'DejaVu', Roboto, sans-serif",
          BASE_FONT_SIZE: '14px'
        }}
      />
    );
  }, [key]);

  useEffect(() => {
    setKey((val) => val + 1);
  }, [logs]);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full bg-background text-foreground">
        <div className="border-2 border-foreground rounded-full border-r-transparent w-5 h-5 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-background text-foreground">
      <div className="flex-1 overflow-y-auto">
        {console}
      </div>
      <div className="flex flex-col">
        {
          error &&
            <div className="px-3 py-1 truncate text-white text-sm bg-red-500">{ error }</div>
        }
        <div
          className="flex flex-row py-1 px-2 text-xs items-center justify-between gap-2"
          style={{
            borderTop: 'solid 1px rgba(255, 255, 255, 0.2)'
          }}>
          <label className="truncate">{statusSentences[status]}</label>
          {
            status !== SandboxStatus.Idle &&
            <div className="w-2.5 h-2.5 border-2 animate-spin rounded-full border-foreground border-r-transparent"></div>
          }
        </div>
      </div>
    </div>
  );
}
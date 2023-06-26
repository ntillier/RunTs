/**
 * @name abcdef
 * @author codemirror.net
 * https://codemirror.net/5/theme/abcdef.css
 */
import { tags } from '@lezer/highlight';
import { CreateThemeOptions } from '@uiw/codemirror-themes';



export const abcdefColors = {
  Background: '#0f0f0f',
  Foreground: '#defdef',
  Selection: '#515151'
}

export const abcdefConfig: CreateThemeOptions = {
  theme: 'dark',
  settings: {
    background: abcdefColors.Background,
    foreground: abcdefColors.Foreground,
    caret: '#00FF00',
    selection: abcdefColors.Selection,
    selectionMatch: '#515151',
    gutterBackground: '#555',
    gutterForeground: '#FFFFFF',
    lineHighlight: '#314151',
  },
  styles: [
    { tag: tags.keyword, color: 'darkgoldenrod', fontWeight: 'bold' },
      { tag: tags.atom, color: '#77F' },
      { tag: tags.comment, color: '#7a7b7c', fontStyle: 'italic' },
      { tag: tags.number, color: 'violet' },
      { tag: tags.definition(tags.variableName), color: '#fffabc' },
      { tag: tags.variableName, color: '#abcdef' },
      { tag: tags.function(tags.variableName), color: '#fffabc' },
      { tag: tags.typeName, color: '#FFDD44' },
      { tag: tags.tagName, color: '#def' },
      { tag: tags.string, color: '#2b4' },
      { tag: tags.meta, color: '#C9F' },
      { tag: tags.bracket, color: '#8a8a8a' },
      { tag: tags.attributeName, color: '#DDFF00' },
      { tag: tags.heading, color: 'aquamarine', fontWeight: 'bold' },
      { tag: tags.link, color: 'blueviolet', fontWeight: 'bold' },
  ]
}
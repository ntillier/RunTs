/**
 * @name androidstudio
 */
import { tags } from '@lezer/highlight';
import { createTheme, CreateThemeOptions } from '@uiw/codemirror-themes';

export const androidStudioColors = {
  Background: '#282b2e',
  Foreground: '#a9b7c6',
  Selection: '#343739'
}

export const androidStudioConfig: CreateThemeOptions = {
  theme: 'dark',
  settings: {
    background: androidStudioColors.Background,
    foreground: androidStudioColors.Foreground,
    caret: '#00FF00',
    selection: androidStudioColors.Selection,
    selectionMatch: '#343739',
    lineHighlight: '#343739',
  },
  styles: [
    { tag: [tags.keyword, tags.deleted, tags.className], color: '#cc7832' },
    { tag: [tags.number, tags.literal, tags.derefOperator], color: '#6897bb' },
    { tag: [tags.link, tags.variableName], color: '#629755' },
    { tag: [tags.comment, tags.quote], color: 'grey' },
    { tag: [tags.meta, tags.documentMeta], color: '#bbb529' },
    { tag: [tags.string, tags.propertyName, tags.attributeValue], color: '#6a8759' },
    { tag: [tags.heading, tags.typeName], color: '#ffc66d' },
    { tag: [tags.attributeName], color: '#a9b7c6' },
    { tag: [tags.emphasis], fontStyle: 'italic' },
  ]
}
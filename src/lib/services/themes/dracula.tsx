/**
 * @name dracula
 * @author dracula
 * Michael Kaminsky (http://github.com/mkaminsky11)
 * Original dracula color scheme by Zeno Rocha (https://github.com/zenorocha/dracula-theme)
 */

import { tags } from '@lezer/highlight';
import { CreateThemeOptions } from '@uiw/codemirror-themes';

export const draculaColors = {
  Background: '#282A36',
  Foreground: '#F8F8F2',
  Selection: '#44475A',
  Comment: '#6272A4',
  Cyan: '#8be9fd',
  Green: '#50fa7b',
  Orange: '#ffb86c',
  Pink: '#ff79c6',
  Purple: '#bd93f9',
  Red: '#ff5555',
  Yellow: '#f1fa8c',
}

export const draculaConfig: CreateThemeOptions = {
  theme: 'dark',
  settings: {
    background: draculaColors.Background,
    foreground: draculaColors.Foreground,
    caret: '#f8f8f0',
    selection: draculaColors.Selection,
    selectionMatch: 'rgba(255, 255, 255, 0.2)',
    gutterBackground: '#282a36',
    gutterForeground: '#6D8A88',
    gutterBorder: 'transparent',
    lineHighlight: draculaColors.Selection
  },
  styles: [
    { tag: tags.comment, color: draculaColors.Comment },
    { tag: [tags.string, tags.regexp], color: draculaColors.Yellow },
    { tag: tags.number, color: draculaColors.Purple },
    { tag: [tags.variableName, tags.attributeName], color: draculaColors.Green },
    { tag: tags.bool, color: draculaColors.Purple },
    { tag: tags.atom, color: draculaColors.Purple },
    { tag: tags.meta, color: draculaColors.Foreground },
    { tag: [tags.keyword, tags.operator, tags.tagName], color: draculaColors.Pink },
    { tag: [tags.function(tags.propertyName), tags.propertyName], color: '#66d9ef' },
    {
      tag: [tags.definition(tags.variableName), tags.function(tags.variableName), tags.className, tags.attributeName],
      color: draculaColors.Green,
    },
  ],
};
import Hobbyfarm_Default from './Hobbyfarm_Default';
import Solarized_Light from './Solarized_Light';
import Solarized_Dark from './Solarized_Dark';
import Solarized_Dark_Higher_Contrast from './Solarized_Dark_Higher_Contrast';
import GitHub from './GitHub';
import Dichromatic from './Dichromatic';
import BashBrawl from './BashBrawl';

// Themes taken from https://github.com/ysk2014/xterm-theme
export const themes = [
  { id: 'BashBrawl', name: 'BashBrawl', styles: BashBrawl },
  {
    id: 'default',
    name: 'Default Hobbyfarm Terminal',
    styles: Hobbyfarm_Default,
  },
  { id: 'Solarized_Light', name: 'Solarized Light', styles: Solarized_Light },
  { id: 'Solarized_Dark', name: 'Solarized Dark', styles: Solarized_Dark },
  {
    id: 'Solarized_Dark_Higher_Contrast',
    name: 'Solarized Dark Higher Contrast',
    styles: Solarized_Dark_Higher_Contrast,
  },
  { id: 'GitHub', name: 'GitHub', styles: GitHub },
  { id: 'Dichromatic', name: 'Dichromatic', styles: Dichromatic },
] as const;

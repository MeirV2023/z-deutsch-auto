// Единый фасад локализации интерфейса (RU / EN / HE) (OCP)
import { RU_TEXT } from './ru.js';
import { EN_TEXT } from './en.js';
import { HE_TEXT } from './he.js';

export const UI_TEXT = {
  ru: RU_TEXT,
  en: EN_TEXT,
  he: HE_TEXT
};

export function getUIText(nativeLang = 'ru') {
  return UI_TEXT[nativeLang] || UI_TEXT.ru;
}

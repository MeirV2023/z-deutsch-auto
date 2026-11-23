// Единый фасад локализации интерфейса (8 языков: RU / EN / DE / ES / UK / TR / HE / AR) (OCP)
import { RU_TEXT } from './ru.js';
import { EN_TEXT } from './en.js';
import { DE_TEXT } from './de.js';
import { ES_TEXT } from './es.js';
import { UK_TEXT } from './uk.js';
import { TR_TEXT } from './tr.js';
import { HE_TEXT } from './he.js';
import { AR_TEXT } from './ar.js';

export const UI_TEXT = {
  ru: RU_TEXT,
  en: EN_TEXT,
  de: DE_TEXT,
  es: ES_TEXT,
  uk: UK_TEXT,
  tr: TR_TEXT,
  he: HE_TEXT,
  ar: AR_TEXT
};

export function getUIText(nativeLang = 'ru') {
  return UI_TEXT[nativeLang] || UI_TEXT.ru;
}

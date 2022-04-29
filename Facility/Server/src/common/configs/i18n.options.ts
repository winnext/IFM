import { I18nOptions } from 'nestjs-i18n';
import * as path from 'path';

/**
 * I18nOptions
 */
export function i18nOptions(directory): I18nOptions {
  return {
    fallbackLanguage: 'tr',
    fallbacks: {
      en: 'en',
      tr: 'tr',
    },
    loaderOptions: {
      path: path.join(directory, '/i18n/'),
      watch: true,
    },
  };
}

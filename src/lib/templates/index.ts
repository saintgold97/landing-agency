/**
 * 📦 Template Registry
 * 
 * Questo file mappa gli ID dei settori ai loro file di configurazione.
 * Utilizza import dinamici (lazy loading) per non appesantire il bundle iniziale.
 */

import { TemplateConfig } from '@/types/template';

// Mappa dei template con caricamento dinamico
export const templates = {
  //generic: () => import('./generic'),
  accommodation: () => import('./accommodation_facility'),
  //restaurant: () => import('./restaurants'),
};

export type TemplateId = keyof typeof templates;
/**
 * Helper per ottenere un template in modo type-safe.
 * Lancia un errore chiaro se l'ID non è valido o il file non esiste.
 */
export async function getTemplate(id: TemplateId): Promise<TemplateConfig> {
  const loader = templates[id];
  
  if (!loader) {
    throw new Error(`Template non trovato: "${id}". ID validi: ${Object.keys(templates).join(', ')}`);
  }

  try {
    const loadedModule = await loader();
    return loadedModule.default;
  } catch (error) {
    console.error(`❌ Errore nel caricamento del template "${id}":`, error);
    //TODO: Implementare un fallback più robusto, ad esempio un template di errore o un messaggio user-friendly
    // Fallback al template generico in caso di errore critico
    // if (id !== 'generic') {
    //   console.warn('⚠️ Fallback al template generico');
    //   const fallback = await templates['generic']();
    //   return fallback.default;
    // }
    throw error;
  }
}

/**
 * Lista semplice di tutti gli ID disponibili (utile per loop o validazioni)
 */
export const templateIds: TemplateId[] = Object.keys(templates) as TemplateId[];
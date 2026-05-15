#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { z } from 'zod';

// 🔍 PERCORSI ALLINEATI ALLA TUA STRUTTURA REALE
const CONTENT_DIR = path.join(process.cwd(), 'src/content/sites');
const OUTPUT_DIR = path.join(process.cwd(), 'src/lib/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'site-index.json');

const siteConfigSchema = z.object({
    meta: z.object({
        version: z.string(),
        sector: z.string(),
        templateId: z.string(),
    }),
    business: z.object({ name: z.string() }),
    domains: z.array(z.string()).optional(),
    assets: z.object({ path: z.string().optional() }).optional(),
});

type SiteIndex = Record<
    string,
    {
        template: string;
        version: string;
        domains: string[];
        assetsPath: string;
    }
>;

async function buildIndex() {
    const index: SiteIndex = {};

    // 1️⃣ Verifica directory sorgente
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`❌ Directory non trovata: ${CONTENT_DIR}`);
        console.log('💡 Verifica che il percorso sia corretto nel tuo progetto.');
        process.exit(1);
    }

    // 2️⃣ Crea directory di output se non esiste
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`📁 Creata directory: ${OUTPUT_DIR}`);
    }

    const slugs = fs
        .readdirSync(CONTENT_DIR)
        .filter((file) =>
            fs.statSync(path.join(CONTENT_DIR, file)).isDirectory()
        );
    console.log(`🔍 Scansione: ${CONTENT_DIR}`);
    console.log(`📂 Cartelle trovate: ${slugs.length}`);

    if (slugs.length === 0) {
        console.warn('⚠️ Nessuna cartella cliente trovata.');
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify({}, null, 2));
        return;
    }

    // 3️⃣ Scansione e validazione
    for (const slug of slugs) {
        const configPath = path.join(CONTENT_DIR, slug, 'config.json');
        
        if (!fs.existsSync(configPath)) {
            console.log(`⏭️  Salto "${slug}": manca config.json`);
            continue;
        }

        try {
            const raw = fs.readFileSync(configPath, 'utf-8');
            const config = siteConfigSchema.parse(JSON.parse(raw));

            index[slug] = {
                template: config.meta.templateId,
                version: config.meta.version,
                domains: config.domains || [`${slug}.tuodominio.it`],
                assetsPath: config.assets?.path || `/content/sites/${slug}/assets`,
            };
            console.log(`✅ Indicizzato: ${slug}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.warn(`⚠️ Errore validazione "${slug}":`, error.message || error);
        }
    }

    // 4️⃣ Scrittura finale
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(index, null, 2));
    console.log(`\n🎉 Generato con successo: ${OUTPUT_FILE}`);
    console.log(`📊 Totale siti nel registry: ${Object.keys(index).length}`);
}

buildIndex();
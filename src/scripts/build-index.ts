#!/usr/bin/env tsx
/**
 * 🏗️ Build Index - Multi-Site SaaS Engine (Production Ready)
 */

import fs from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { siteConfigSchema } from '@/types/site-config';
import { fileURLToPath } from 'url';

// ============================================================================
// ⚙️ CONFIG
// ============================================================================

const CONFIG = {
    CONTENT_DIR:
        process.env.CONTENT_DIR ||
        path.join(process.cwd(), 'src/content/sites'),

    OUTPUT_DIR:
        process.env.OUTPUT_DIR ||
        path.join(process.cwd(), 'src/lib/data'),

    OUTPUT_FILE:
        process.env.OUTPUT_FILE || 'site-index.json',

    BACKUP_ENABLED: process.env.BACKUP_INDEX !== 'false',

    SLUG_REGEX: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    DOMAIN_REGEX:
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i,
} as const;

// ============================================================================
// 📦 TYPES INDEX
// ============================================================================

type SiteIndexEntry = {
    template: string;
    version: string;
    domains: string[];
    assetsPath: string;
    locale: string;
};

type SiteIndex = Record<string, SiteIndexEntry>;

// ============================================================================
// 🪵 LOGGER
// ============================================================================

const logger = {
    info: (msg: string, meta?: unknown) =>
        console.log(`[INFO] ${msg}`, meta ?? ''),
    warn: (msg: string, meta?: unknown) =>
        console.warn(`[WARN] ${msg}`, meta ?? ''),
    error: (msg: string, meta?: unknown) =>
        console.error(`[ERROR] ${msg}`, meta ?? ''),
    success: (msg: string) => console.log(`✅ ${msg}`),
};

// ============================================================================
// 🔐 VALIDATION
// ============================================================================

function validateSlug(slug: string): boolean {
    return (
        CONFIG.SLUG_REGEX.test(slug) &&
        slug.length <= 50 &&
        !slug.includes('..')
    );
}

// ============================================================================
// 🧾 ATOMIC WRITE
// ============================================================================

async function atomicWrite(filePath: string, content: string) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    const tempPath = `${filePath}.tmp.${Date.now()}`;

    if (CONFIG.BACKUP_ENABLED && existsSync(filePath)) {
        const backupPath = `${filePath}.backup.${Date.now()}`;
        await fs.copyFile(filePath, backupPath);
        logger.info(`Backup creato: ${path.basename(backupPath)}`);
    }

    await fs.writeFile(tempPath, content, 'utf-8');
    await fs.rename(tempPath, filePath);
}

// ============================================================================
// 🚀 BUILD INDEX
// ============================================================================

async function buildIndex(
    { dryRun = false, verbose = false } = {}
) {
    const index: SiteIndex = {};
    const errors: Array<{ slug: string; error: string }> = [];

    logger.info('🚀 Build index start', {
        contentDir: CONFIG.CONTENT_DIR,
        dryRun,
    });

    // 1️⃣ check directory
    if (!existsSync(CONFIG.CONTENT_DIR)) {
        logger.error(`Missing dir: ${CONFIG.CONTENT_DIR}`);
        process.exit(1);
    }

    // 2️⃣ read folders (ASYNC SAFE)
    const rawFiles = await fs.readdir(CONFIG.CONTENT_DIR);

    const slugs = [];

    for (const file of rawFiles) {
        const fullPath = path.join(CONFIG.CONTENT_DIR, file);

        try {
            const stat = await fs.stat(fullPath);

            if (stat.isDirectory() && validateSlug(file)) {
                slugs.push(file);
            }
        } catch {
            continue;
        }
    }

    logger.info(`Found ${slugs.length} sites`);

    if (slugs.length === 0) {
        logger.warn('No valid sites found');

        if (!dryRun) {
            await atomicWrite(
                path.join(CONFIG.OUTPUT_DIR, CONFIG.OUTPUT_FILE),
                JSON.stringify({}, null, 2)
            );
        }

        return;
    }

    // 3️⃣ process sites
    for (const slug of slugs) {
        const configPath = path.join(
            CONFIG.CONTENT_DIR,
            slug,
            'config.json'
        );

        if (!existsSync(configPath)) {
            logger.warn(`Skip ${slug}: missing config.json`);
            continue;
        }

        try {
            const raw = await fs.readFile(configPath, 'utf-8');

            const json = JSON.parse(raw);

            const config = siteConfigSchema.parse(json);

            index[slug] = {
                template: config.meta.templateId,
                version: config.meta.version,
                domains: config.domains,
                assetsPath: config.assets?.path
                    ? config.assets.path.replace(/^\/+/, '')
                    : `content/sites/${slug}/assets`,
                locale: config.business.locale,
            };

            if (verbose) logger.success(`Indexed: ${slug}`);
        } catch (err) {
            logger.warn(`❌ Invalid config for ${slug}`, err);
            errors.push({ slug, error: String(err) });
            continue;
        }
    }

    // 4️⃣ write output
    const outputPath = path.join(
        CONFIG.OUTPUT_DIR,
        CONFIG.OUTPUT_FILE
    );

    if (!dryRun) {
        await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });

        await fs.writeFile(
            outputPath,
            JSON.stringify(index, null, 2),
            'utf-8'
        );
    }

    logger.success(`Index generated: ${outputPath}`);
    logger.info(
        `Sites: ${Object.keys(index).length}, errors: ${errors.length}`
    );
}

// ============================================================================
// 🧭 CLI
// ============================================================================

function parseArgs() {
    const args = process.argv.slice(2);

    return {
        dryRun: args.includes('--dry-run'),
        verbose: args.includes('--verbose'),
    };
}

// ============================================================================
// 🚀 RUN
// ============================================================================

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
    const flags = parseArgs();

    buildIndex(flags).catch((err) => {
        logger.error('Build failed', err);
        process.exit(1);
    });
}

export { buildIndex, siteConfigSchema };
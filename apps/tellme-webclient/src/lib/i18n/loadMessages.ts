import fs from 'fs/promises';
import path from 'path';

const localeCache: Record<string, Record<string, any>> = {};

export async function loadNamespaceServer(
    locale: string,
    namespaces: string | string[]
) {
    localeCache[locale] ||= {};

    const namespaceList = Array.isArray(namespaces) ? namespaces : [namespaces];
    const loadedNamespaces: Record<string, any> = {};

    await Promise.all(
        namespaceList.map(async (ns) => {
            if (!ns) return; // ignore empty namespace

            if (!localeCache[locale][ns]) {
                const filePath = path.join(process.cwd(), 'public', 'locales', locale, `${ns}.json`);
                const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
                localeCache[locale][ns] = data;
            }

            loadedNamespaces[ns] = localeCache[locale][ns];
        })
    );

    console.log("--cache", loadedNamespaces);
    return loadedNamespaces;
}

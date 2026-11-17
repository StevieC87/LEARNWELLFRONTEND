// Reusable server-side helpers for fetching page data and reading fields

export async function fetchPageData(page = 'homepage', language) {
    let res
    let fetchurl
    try {

        if (language === 'undefined' || !language) {
            fetchurl = `${process.env.NEXT_PUBLIC_API_URL}/api/monolingual/${page}`;

        }
        else {
            fetchurl = `${process.env.NEXT_PUBLIC_API_URL}/api/multilingual/${page}?language=${language}`;
        }
        res = await fetch(fetchurl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            // keep default caching behavior; caller can override if needed
        });
        if (!res.ok) {
            console.log('fetch failed');
            return { error: true, data: null, fields: [] };
        }
        const json = await res.json();
        return {
            error: false,
            data: json,
            fields: Array.isArray(json.pagefieldsarray) ? json.pagefieldsarray : [],
        };
    } catch (e) {
        return { error: true, data: null, fields: [] };
    }
}

/**
 * Get field value from fields array or return media URL when type === 'medialibrary'
 * - fields: array of { name, content }
 * - data: full response (optional) used for images if needed
 */
export function getFieldValue(fields, fieldName, type = 'text') {
    try {
        console.log('hello from getfieldvalue22');
        console.log(fields, fieldName);

        if (!Array.isArray(fields)) {
            console.log('fields not array');
            return '';
        }
        if (!fields) {
            console.log('no field');
            return '';
        }

        const field = fields.find((f) => f.name === fieldName);

        if (type === 'medialibrary') {
            console.log('hello here1');

            const imageid = field?.content?.imageidstring || null;
            if (!imageid) return '';
            return `${process.env.NEXT_PUBLIC_API_URL}/media/getmedia/${imageid}`;
        }
        else {
            console.log('hello here2');
            console.log(field, 'fieldfieldfield22');
            return field?.content ?? '';

        }
    } catch (e) {
        console.log('error in getFieldValue', e);
        return '';
    }

}

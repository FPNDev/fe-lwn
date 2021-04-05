import { lwnEval } from "./eval";
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
const re = new RegExp(`${escapeRegex('{{')}(.*?(?<!${escapeRegex('}}')}))${escapeRegex('}}')}`, 'g');
export function interpolate(element, context) {
    let html = element.innerHTML;
    const matches = [...html.matchAll(re)];
    for (const match of matches) {
        let result = match[0];
        try {
            result = lwnEval(match[1], context);
            result = result.toString();
        }
        catch (e) { }
        html = html.replace(match[0], result);
    }
    return html;
}

import { lwnEval } from "./eval";

function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function interpolate(element, config, context) {
    const re = new RegExp(`${escapeRegex(config[0])}\\s*(?:(.*?)?(?:\\s*)(?<!${escapeRegex(config[1])}))${escapeRegex(config[1])}`, 'g');
    const matches = [...element.innerHTML.matchAll(re)];
    
    for (const match of matches) {
        const node = document.evaluate(
            `.//text()[contains(., "${match[0].replaceAll('"', '\\"')}")]`,
            element,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE
            
        ).singleNodeValue;

        let result = '';
        try {
            result = lwnEval(match[1], context);
            result = result.toString();
        } catch(e) {}

        node.textContent = node.textContent.replace(match[0], result);
    }
}

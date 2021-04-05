export function lwnEval(code, context) {
    return (new Function(`with(this) { return ${code} }`)).call(context);
}
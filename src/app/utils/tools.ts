export function isEmptyObject(obj: object): boolean {
    return JSON.stringify(obj) === '{}';
}

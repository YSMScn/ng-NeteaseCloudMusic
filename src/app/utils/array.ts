import { getRandomInt } from './number';

export function shuffle<T>(arr: T[]):T[]{
    const result = arr.slice();
    for(let i = 0; i < result.length; i++){
        const j = getRandomInt([0,i]);
        [result[i],result[j]]=[result[j],result[i]]
    }
    return result;
}
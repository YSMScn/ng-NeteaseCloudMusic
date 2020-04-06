import { getRandomInt } from './number';
import { Song } from '../services/data-types/common-types';

export function shuffle<T>(arr: T[]):T[]{
    const result = arr.slice();
    for(let i = 0; i < result.length; i++){
        const j = getRandomInt([0,i]);
        [result[i],result[j]]=[result[j],result[i]]
    }
    return result;
}

export function findIndex(list:Song[],currentSong:Song):number{
    return list.findIndex(item => item.id === currentSong.id);
}
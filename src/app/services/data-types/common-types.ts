import { NumberValueAccessor } from '@angular/forms'

export type Banner = {
    targetId:number;
    url:string;
    imageUrl:string;
}

export type HotTag = {
    id: number;
    name: string;
    position: number;
}

export type SongList = {
    id: number;
    name: string;
    playCount: number;
    picUrl: string;
    tracks:Song[];
    
}

export type Singer = {
    id:number;
    name:string;
    picUrl:string;
    albumSize:number;
}

export type Song = {
    id:number;
    name:string;
    url:string;
    ar:Singer[];
    al:{id:number;name:string;picUrl:string}
    dt:number;
}

export type SongUrl = {
    id:number;
    url:string;
}

export type Lyric = {
    lyric:string;
    tlyric:string;
}
//SheetList
export type PlayList={
    playlists:SongList[];
    total:NumberValueAccessor;
}
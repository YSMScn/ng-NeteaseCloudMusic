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
}

export type Singer = {
    id:number;
    name:string;
    picUrl:string;
    albumSize:number;
}
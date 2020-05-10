import { NumberValueAccessor } from '@angular/forms';

export interface Banner {
    targetId: number;
    targetType: number;
    url: string;
    imageUrl: string;
}

export interface HotTag {
    id: number;
    name: string;
    position: number;
}

export interface SongList {
    id: number;
    userId: number;
    name: string;
    playCount: number;
    picUrl: string;
    coverImgUrl: string;
    tags: string[];
    createTime: number;
    creator: {nickname: string; avatarUrl: string};
    description: string;
    subscribedCount: number;
    shareCount: number;
    commentCount: number;
    subscribed: boolean;
    tracks: Song[];
    trackCount: number;

}

export interface Singer {
    id: number;
    name: string;
    alias: string[];
    picUrl: string;
    albumSize: number;
}

export interface SingerDetail {
    artist: Singer;
    hotSongs: Song[];

}

export interface Song {
    id: number;
    name: string;
    url: string;
    ar: Singer[];
    al: {id: number; name: string; picUrl: string};
    dt: number;
}

export interface SongUrl {
    id: number;
    url: string;
}

export interface Lyric {
    lyric: string;
    tlyric: string;
}
// SheetList
export interface PlayList {
    playlists: SongList[];
    total: NumberValueAccessor;
}

export interface SearchResult {
    artists?: Singer[];
    playlists?: SongList[];
    songs?: Song[];

}

export interface LoginParams {
  phone: number;
  password: string;
  remember: boolean;
}

export interface SimpleBack extends AnyJson {
  code: number;
}

export interface AnyJson {
  [key: string]: any;
}

export interface Album {
  songs: Song[];
  album: AlbumDetail;
}

export interface AlbumDetail {
  artist: Singer;
  picUrl: string;
  id: number;
  description: string;
  company: string;
  size: number;
  name: string;
  info: {shareCount: number};
}

export interface ArtistAlbum {
  artist: Singer;
  hotAlbums: AlbumDetail[];
}

import { Song, SongList } from './common-types'

export interface User {
  // 等级
  level?: number;
  code?:number;
  // 听歌记录
  listenSongs?: number;

  profile: {
    userId: number;
    nickname: string;
    avatarUrl: string;
    backgroundUrl: string;
    signature: string;

    // 性别
    gender: number;

    // 粉丝
    followeds: number;

    // 关注
    follows: number;

    // 动态
    eventCount: number;
  };
};

export type Checkin = {
  code:number;
  point?:number;
  msg?:string;
};

export type recordVal = {
  playCount:number;
  score:number;
  song:Song;
};

type recordKeys = 'weekData' | 'allData';
export type UserRecord = {
  [key in recordKeys]:recordVal[];
}

export type UserSongList = {
  self:SongList[];
  subscribed:SongList[];

}

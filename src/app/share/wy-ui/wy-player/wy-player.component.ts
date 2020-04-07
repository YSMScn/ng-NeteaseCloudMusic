import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong } from 'src/app/store/selectors/player.selector';
import { Song } from 'src/app/services/data-types/common-types';
import { PlayMode } from './player-types';
import { SetCurrentIndex, SetPlayMode, SetPlayList, SetSongList } from 'src/app/store/actions/player.action';
import { Subscription, fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { NzModalService } from 'ng-zorro-antd';

const modeTypes:PlayMode[]= [{
  type:'loop',
  label:'Loop'
},{
  type:'random',
  label:'Random'
},{
  type:'singleLoop',
  label:'Single Loop'
}]
@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  percent = 0;
  bufferOffset1 = 0;
  volumnPercent = 60;
  showVolumnPanel=false;
  showPanel=false;
  songList:Song[];
  playList:Song[];
  currentIndex:number;
  currentMode:PlayMode;
  currentSong:Song;
  duration:number;
  currentTime:number;
  modeCount = 0;
  //playing status
  playing = false;
  //Is the song ready to play
  songReady = false;
  //check if we are clicking volPanel itself
  selfClick = false;
  private winClick:Subscription;
  
  
  @ViewChild('audio',{static:true}) private audio:ElementRef;
  @ViewChild(WyPlayerPanelComponent,{static:false}) private playerPanel:WyPlayerPanelComponent;
  private audioEl:HTMLAudioElement;
  constructor(
    private store$:Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc:Document,
    private nzModalServe:NzModalService
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer)); 
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
    // appStore$.pipe(select(getCurrentAction)).subscribe(action => this.watchCurrentAction(action));

    // const stateArr = [{
    //   type:getSongList,
    //   cb: list=>this.watchList(list,'songList')
    // },
    // {
    //   type:getPlayList,
    //   cb: list=>this.watchList(list,'playList')
    // },
    // {
    //   type:getCurrentIndex,
    //   cb: index=>this.watchCurrentIndex(index)
    // }];

    // stateArr.forEach(item=>{
    //   appStore$.pipe(select(item.type)).subscribe(item.cb);
    // })
  }

  ngOnInit(): void {
    this.audioEl=this.audio.nativeElement;
  }

  private watchList(list: Song[],type:string){
    this[type]=list;
    //First time see this way! this[]
  }
  private watchCurrentIndex(index: number){
    this.currentIndex = index; 
  }

  private watchPlayMode(mode: PlayMode) {
     this.currentMode = mode;
    if (this.songList) {
      let list = this.songList.slice();
      if (mode.type === 'random') {
        list = shuffle(this.songList);
        this.updateCurrentIndex(list, this.currentSong);
        this.store$.dispatch(SetPlayList({ playList: list }));
      }
      
    }
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    // this.bufferPercent = 0;
    if (song) {
      this.duration = song.dt / 1000;
    }
    //for later on
  }

  updateCurrentIndex(list:Song[],currentSong:Song){
    const newIndex = list.findIndex(item => item.id === currentSong.id);
    // const newIndex = findIndex(list,currentSong);
    this.store$.dispatch(SetCurrentIndex({currentIndex:newIndex}));
  }
  //play or pause
  onToggle(){
    if(!this.currentSong){
      if(this.playList.length){
        this.updateIndex(0);
        console.log('..............................................');
      }
    }else{
      if(this.songReady){
        this.playing = !this.playing;
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        if(this.playing){
          this.audioEl.play();
        }else{
          this.audioEl.pause();
        }
      }
    }
    
  }

  onPrev(index:number){
    if(!this.songReady) {return;}
    if(this.playList.length === 1){
      this.loop();
    }
    const newIndex = index<0?this.playList.length-1:index;
    this.updateIndex(newIndex);

  }

  onNext(index:number){
    if(!this.songReady) {return;}
    if(this.playList.length === 1){
      this.loop();
    }
    const newIndex = index>=this.playList.length?0:index;
    this.updateIndex(newIndex);
    
  }

  loop(){
    this.audioEl.currentTime = 0;
    this.play();
    if(this.playerPanel){
      this.playerPanel.seekLyric(0);
    }
  }

  updateIndex(index:number){
    this.store$.dispatch(SetCurrentIndex({currentIndex:index}));
    this.songReady=false;
  }

  onCanPlay(){
    this.songReady=true;
    this.play();
  }

  private play(){
    this.audioEl.play();
    this.playing=true;
  }

  get picUrl():string{
    return this.currentSong?this.currentSong.al.picUrl:'//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }

  onTimeUpdate(e:Event){
    // this.currentTime=(<HTMLAudioElement>e.target).currentTime;
    // console.log('currentTime:',this.currentTime);
    // this.percent=(this.currentTime/this.duration)*100;
    // console.log('percent:',(this.percent));
    
    
    
    
    this.currentTime = (e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;

    const buffered = this.audioEl.buffered;
    if(buffered.length && this.bufferOffset1 < 100){
      this.bufferOffset1 = (buffered.end(0))/this.duration*100;
    }
  }

  onPercentChange(per:number){
    if(this.currentSong){
      const currentTime =  this.duration * (per / 100);
      this.audioEl.currentTime=currentTime;
      if(this.playerPanel){
        this.playerPanel.seekLyric(currentTime * 1000);
      }
      
    }
    
  }
  onVolumnChange(per:number){
    this.audioEl.volume = per/100;
  }

  togglePanel(type:string){
    this[type] = !this[type];
    if(this.showVolumnPanel||this.showPanel){
      this.bindDocumentClickListener();
    }else{
      this.unbindDocumentClickListener();
    }
  }

  private bindDocumentClickListener(){
    if(!this.winClick){
      this.winClick = fromEvent(this.doc,'click').subscribe(()=>{
        if(!this.selfClick){//clicked outside player panel
          this.showVolumnPanel = false;
          this.showPanel = false;
          this.unbindDocumentClickListener();
        }
        this.selfClick = false;
      });
    }
  }

  private unbindDocumentClickListener(){
    if(this.winClick){
      this.winClick.unsubscribe();
      this.winClick = null;
    }
  }

  toggleVolPanel(evt:MouseEvent){
    //evt.stopPropagation(); Added <div class="m-player" (click)="selfClick = true"> to block, we don't need this line now
    this.togglePanel("showVolumnPanel");
  }

  toggleListPanel(){
    if(this.songList.length){
      this.togglePanel('showPanel');
    }
    
  }

  changeMode(){
    const temp= modeTypes[++this.modeCount%3];
    this.store$.dispatch(SetPlayMode({playMode:temp}));
  }

  onEnded(){
    console.log('onEnded!!!!!!!!!!!');
    this.playing =false;
    if(this.currentMode.type === 'singleLoop'){
      this.loop();
    }
    else{
      this.onNext(this.currentIndex+1);
    }
  }

  onChangeSong(song:Song){
    // this.currentSong=song;
    // this.currentIndex = this.songList.indexOf(song);
    this.updateCurrentIndex(this.playList,song);
    //this.play();
  }

  onDeleteSong(song:Song){
    const songList = this.songList.slice();
    const playList = this.playList.slice();
    let currentIndex = this.currentIndex;
    const songIndex = findIndex(songList,song);
    songList.splice(songIndex,1)
    const playIndex = findIndex(playList,song);
    playList.splice(playIndex,1)
    if(currentIndex > playIndex || currentIndex == playList.length){
      currentIndex--;
    }
    this.store$.dispatch(SetSongList({songList:songList}));
    this.store$.dispatch(SetPlayList({playList:playList}));
    this.store$.dispatch(SetCurrentIndex({currentIndex:currentIndex}));
  }
  onClearSong(){
    this.nzModalServe.confirm({
      nzTitle:'Do you want to clear this list?',
      nzOnOk:()=>{
        this.store$.dispatch(SetSongList({songList:null}));
        this.store$.dispatch(SetPlayList({playList:null}));
        this.store$.dispatch(SetCurrentIndex({currentIndex:-1}));
      }
    })
    
  }
}

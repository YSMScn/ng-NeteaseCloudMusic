import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getSongList, getPlayList, getCurrentIndex, getPlayer, getPlayMode, getCurrentSong, getCurrentAction } from 'src/app/store/selectors/player.selector';
import { Song, Singer, SongList } from 'src/app/services/data-types/common-types';
import { PlayMode } from './player-types';
import { SetCurrentIndex, SetPlayMode, SetPlayList, SetSongList, SetCurrentAction } from 'src/app/store/actions/player.action';
import { Subscription, fromEvent, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { shuffle, findIndex } from 'src/app/utils/array';
import { WyPlayerPanelComponent } from './wy-player-panel/wy-player-panel.component';
import { NzModalService } from 'ng-zorro-antd';
import { BatchActionsService } from 'src/app/store/batch-actions.service';
import { Router } from '@angular/router';
import { trigger, transition, animate, state, style, AnimationEvent } from '@angular/animations';
import { CurrentActions } from 'src/app/store/reducers/player.reducer';
import { SetShareInfo } from 'src/app/store/actions/member.action';

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

enum TipTitles {
  Add = 'Added to current list',
  Play = 'Its playing now~'
}
@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['wy-player.component.less'],
  animations: [trigger('showHide',[
    state('show',style({bottom:0})),
    state('hide',style({bottom:-71})),
    transition('show=>hide',[animate('0.3s')]),
    transition('hide=>show',[animate('0.1s')])
  ])]
})
export class WyPlayerComponent implements OnInit {
  controlTooltip = {
    title:'',
    show:false
  }

  showPlayer = 'hide';
  isLocked = false;
  animating = false;
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
  bindFlag = false;
  private winClick:Subscription;


  @ViewChild('audio',{static:true}) private audio:ElementRef;
  @ViewChild(WyPlayerPanelComponent,{static:false}) private playerPanel:WyPlayerPanelComponent;
  private audioEl:HTMLAudioElement;
  constructor(
    private store$:Store<AppStoreModule>,
    @Inject(DOCUMENT) private doc:Document,
    private nzModalServe:NzModalService,
    private batchActionServe:BatchActionsService,
    private router:Router
  ) {
    const appStore$ = this.store$.pipe(select(getPlayer));
    appStore$.pipe(select(getSongList)).subscribe(list => this.watchList(list, 'songList'));
    appStore$.pipe(select(getPlayList)).subscribe(list => this.watchList(list, 'playList'));
    appStore$.pipe(select(getCurrentIndex)).subscribe(index => this.watchCurrentIndex(index));
    appStore$.pipe(select(getPlayMode)).subscribe(mode => this.watchPlayMode(mode));
    appStore$.pipe(select(getCurrentSong)).subscribe(song => this.watchCurrentSong(song));
    appStore$.pipe(select(getCurrentAction)).subscribe(currentAction => this.watchCurrentAction(currentAction));
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
      }
      this.updateCurrentIndex(list, this.currentSong);
      this.store$.dispatch(SetPlayList({ playList: list }));

    }
  }

  private watchCurrentSong(song: Song) {
    this.currentSong = song;
    this.bufferOffset1 = 0;
    if (song) {
      this.duration = song.dt / 1000;
    }
    //for later on
  }

  private watchCurrentAction(action:CurrentActions){
    const title = TipTitles[CurrentActions[action]];

    console.log('title: ',title);
    if(title){
      this.controlTooltip.title = title;
      if(this.showPlayer === 'hide'){
        this.togglePlayer('show');
      }else{
        this.showToolTip();
      }
    }
    this.store$.dispatch(SetCurrentAction({currentAction:CurrentActions.Other}));
  }

  onAnimationDone(event:AnimationEvent){
    this.animating=false;
    if(event.toState === 'show' && this.controlTooltip.title){
      this.showToolTip();
    }
  }
  private showToolTip(){
    this.controlTooltip.show = true;
    timer(1500).subscribe(()=>{
      this.controlTooltip = {
        title:'',
        show:false
      }
    })
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
      this.bindFlag = true;
    }else{
      this.bindFlag = false;
    }
  }

  // private bindDocumentClickListener(){
  //   if(!this.winClick){
  //     this.winClick = fromEvent(this.doc,'click').subscribe(()=>{
  //       if(!this.selfClick){//clicked outside player panel
  //         this.showVolumnPanel = false;
  //         this.showPanel = false;
  //         this.unbindDocumentClickListener();
  //       }
  //       this.selfClick = false;
  //     });
  //   }
  // }

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
    this.updateCurrentIndex(this.playList,song);
  }

  onDeleteSong(song:Song){
    this.batchActionServe.deleteSong(song);
  }
  onClearSong(){
    this.nzModalServe.confirm({
      nzTitle:'Do you want to clear this list?',
      nzOnOk:()=>{
        this.batchActionServe.clearSong();
      }
    })
  }

  onClickOutside(target:HTMLElement){
    if(target.dataset.act !== 'delete'){
      this.showVolumnPanel = false;
      this.showPanel = false;
      this.bindFlag = false;
    }
    //this.unbindDocumentClickListener();
  }

  toInfo(path:[string,number]){
    console.log('toInfo: ', path);
    if(path[1]){
      this.showVolumnPanel = false;
      this.showPanel = false;
      this.router.navigate(path);
    }

  }

  togglePlayer(type:string){
    if(!this.isLocked && !this.animating){
      this.showPlayer=type;
    }
  }

  onError(){
    console.log("onError");
    this.playing = false;
    this.bufferOffset1 = 0;
  }

  onLikeSong(id:string){
    this.batchActionServe.likeSong(id);
  }

  onShare(resource:Song){
    const type = 'song';
    let txt = '';
    txt = this.makeTxt('Song',resource.name,(<Song>resource).ar);
    this.store$.dispatch(SetShareInfo({shareInfo:{id:resource.id.toString(),type,txt}}))
    console.log(txt);
  }

  private makeTxt(type:string,name:string,makeBy:Singer[]):string{
    let makeByStr = '';
    if(Array.isArray(makeBy)){
      makeByStr = makeBy.map(item => item.name).join('/');
    }
    else{
      makeByStr = makeBy;
    }
    return `${type}: ${name} -- ${makeByStr}`;
  }
}

import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult, LoginParams, SongList } from './services/data-types/common-types';
import { isEmptyObject } from './utils/tools';
import { ModalTypes } from './store/reducers/member.reducer';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store';
import { SetModalType, SetUserId, SetModalVisiable } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { MemberService } from './services/member.service';
import { User } from './services/data-types/member-types';
import { NzMessageBaseService, NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ng-NeteaseCloudMusic';
  menu=[{
    label:'Find',
    path:'/home'
  },{
    label:'List',
    path:'/sheet'
  }
  ]

  searchResult:SearchResult;
  user:User;
  wyRememberLogin:LoginParams;
  mySheets:SongList[];
  constructor(private searchServe:SearchService,
    private store$:Store<AppStoreModule>,
    private batchActionsServe:BatchActionsService,
    private memberServe:MemberService,
    private message:NzMessageService,
    private storageServe:StorageService
    ){
      const userId = storageServe.getStorage('wyUserId');
      if(userId){
        this.store$.dispatch(SetUserId({userId:userId}));
        this.memberServe.getUserDetail(userId).subscribe(res=>this.user = res);
      }
      const wyRememberLogin = storageServe.getStorage('wyRememberLogin');
      if(wyRememberLogin){
        this.wyRememberLogin = JSON.parse(wyRememberLogin);
      }
    }
  onSearch(keywords:string){
    console.log("keyword: ", keywords);
    if(keywords){
      this.searchServe.search(keywords).subscribe(res =>{
        this.searchResult = this.highlightKeyword(keywords,res);
      });
    }else{
      this.searchResult = {};
    }
  }

  private highlightKeyword(keywords:string,searchResult:SearchResult):SearchResult{
    if(!isEmptyObject(searchResult)){
      const reg = new RegExp(keywords,'ig');
      ['artists','playlists','songs'].forEach(type =>{
        if(searchResult[type]){
          searchResult[type].forEach(item =>{
            item.name = item.name.replace(reg,'<span class="highlight">$&</span>');
          })
        }
      });
      return searchResult;
    }
  }

  onChangeModalType(type = ModalTypes.default){
    this.store$.dispatch(SetModalType({modalType:type}));
  }

  openModal(type: any){
    console.log(typeof(type));
    this.batchActionsServe.controlModal(true,type);
  }

  onLogin(params:LoginParams){
    this.memberServe.login(params).subscribe(user =>{
      if(user.code === 200){
        this.user = user;
        this.batchActionsServe.controlModal(false);
        this.alertMessage('success',"Log in Successed");
        this.storageServe.setStorage({
          key:'wyUserId',
          value:user.profile.userId
        })
        this.store$.dispatch(SetUserId({userId:user.profile.userId.toString()}));
        if(params.remember){
          this.storageServe.setStorage({
            key:'wyRememberLogin',
            value: JSON.stringify(codeJson(params))
          })
          //localStorage.setItem('wyRememberLogin',JSON.stringify(codeJson(params)));
        }
        else{
          this.storageServe.removeStorage('wyRememberLogin');
          // localStorage.removeItem('wyRememberLogin');
        }
      }
      if(user.code === 502){
        this.alertMessage('error', "Wrong Password");
      }
    },error =>{
      this.alertMessage('error', error.message || "Login failed");
    })
  }

  private alertMessage(type:string,msg:string){
    this.message.create(type,msg);
  }

  onLogout(){
    this.memberServe.logout().subscribe(res => {
      this.user = null;
      this.storageServe.removeStorage('wyUserId');
      // localStorage.removeItem('wyUserId');
      this.alertMessage('success',"Logout Successed");
    },error =>{
      this.alertMessage('error', error.message || "Logout failed")
    });
    this.store$.dispatch(SetUserId({userId:''}));
  }

  onLoadMySheets(){
    if(this.user){
      this.memberServe.getUserSongList(this.user.profile.userId.toString()).subscribe(sheets => {
        this.mySheets = sheets.self;
        this.store$.dispatch(SetModalVisiable({modalVisiable:true}));
      })
    }else{
      this.openModal(ModalTypes.default);
    }
  }
}

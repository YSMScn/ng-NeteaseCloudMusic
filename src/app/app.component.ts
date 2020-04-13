import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult, LoginParams } from './services/data-types/common-types';
import { isEmptyObject } from './utils/tools';
import { ModalTypes } from './store/reducers/member.reducer';
import { Store } from '@ngrx/store';
import { AppStoreModule } from './store';
import { SetModalType } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { MemberService } from './services/member.service';
import { User } from './services/data-types/member-types';
import { NzMessageBaseService, NzMessageService } from 'ng-zorro-antd';

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

  constructor(private searchServe:SearchService,
    private store$:Store<AppStoreModule>,
    private batchActionsServe:BatchActionsService,
    private memberServe:MemberService,
    private message:NzMessageService
    ){}
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

  openModal(type: ModalTypes){
    console.log(typeof(type));
    this.batchActionsServe.controlModal(true,type);
  }

  onLogin(params:LoginParams){
    this.memberServe.login(params).subscribe(user =>{
      this.user = user;
      this.batchActionsServe.controlModal(false);
      this.alertMessage('success',"Log in Successed");
    })
  }

  private alertMessage(type:string,msg:string){
    this.message.create(type,msg);
  }
}

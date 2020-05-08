import { Component, inject, Inject } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult, LoginParams, SongList } from './services/data-types/common-types';
import { isEmptyObject } from './utils/tools';
import { ModalTypes, ShareInfo } from './store/reducers/member.reducer';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from './store';
import { SetModalType, SetUserId, SetModalVisiable } from './store/actions/member.action';
import { BatchActionsService } from './store/batch-actions.service';
import { MemberService, likeSongParamas, shareParams } from './services/member.service';
import { User } from './services/data-types/member-types';
import { NzMessageBaseService, NzMessageService } from 'ng-zorro-antd';
import { codeJson } from './utils/base64';
import { StorageService } from './services/storage.service';
import { getMember, getLikeId, getModalVisiable, getModalType, getShareInfo } from './store/selectors/member.selector';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { filter, map, mergeMap, takeUntil } from 'rxjs/internal/operators';
import { Observable, interval } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'ng-NeteaseCloudMusic';
  menu = [{
    label: 'Find',
    path: '/home'
  }, {
    label: 'List',
    path: '/sheet'
  }
  ];

  searchResult: SearchResult;
  user: User;
  wyRememberLogin: LoginParams;
  mySheets: SongList[];
  likeId: string;
  visiable = false;
  currentModaltype = ModalTypes.default;
  shareInfo: ShareInfo;
  showSpin = false;
  private navEnd: Observable<NavigationEnd>;
  routeTitle: string;
  loadPercent = 0;

  constructor(private searchServe: SearchService,
              private store$: Store<AppStoreModule>,
              private batchActionsServe: BatchActionsService,
              private memberServe: MemberService,
              private message: NzMessageService,
              private storageServe: StorageService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private titleServe: Title,
    // @Inject(DOCUMENT) private doc:Document
    ) {
      const userId = storageServe.getStorage('wyUserId');
      if (userId) {
        this.store$.dispatch(SetUserId({userId}));
        this.memberServe.getUserDetail(userId).subscribe(res => this.user = res);
      }
      const wyRememberLogin = storageServe.getStorage('wyRememberLogin');
      if (wyRememberLogin) {
        this.wyRememberLogin = JSON.parse(wyRememberLogin);
      }
      this.listenStates();
      this.router.events.pipe(filter(evt => evt instanceof NavigationStart)).subscribe(() => {
        this.loadPercent = 0;
        this.setTitle();
      });
      this.navEnd = this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)) as Observable<NavigationEnd>;
      this.setLoadingBar();
    }

  private setLoadingBar() {
    interval(100).pipe(takeUntil(this.navEnd)).subscribe(() => {
      this.loadPercent = Math.max(95, ++this.loadPercent);
      // this.loadPercent = this.loadPercent + 10;
      console.log('this.loadPercent: ', this.loadPercent);
    });
    this.navEnd.subscribe(() => {
      this.loadPercent = 100;
      // this.doc.documentElement.scrollTop = 0;
    });
  }

  private setTitle() {
    this.navEnd.pipe(
      map(() => this.activatedRoute),
      map((route: ActivatedRoute) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      mergeMap(route => route.data)
      ).subscribe(data => {
        // console.log('data: ', data);
        this.routeTitle = data.title;
        this.titleServe.setTitle(this.routeTitle);
      });
  }
  onSearch(keywords: string) {
    // console.log('keyword: ', keywords);
    if (keywords) {
      this.searchServe.search(keywords).subscribe(res => {
        this.searchResult = this.highlightKeyword(keywords, res);
      });
    } else {
      this.searchResult = {};
    }
  }

  private listenStates() {
    const appStore$ = this.store$.pipe(select(getMember));
    appStore$.pipe(select(getLikeId)).subscribe(id => this.watchLikeId(id));
    appStore$.pipe(select(getModalVisiable)).subscribe(visiable => this.watchModalVisiable(visiable));
    appStore$.pipe(select(getModalType)).subscribe(type => this.watchModalType(type));
    appStore$.pipe(select(getShareInfo)).subscribe(shareInfo => this.watchShareInfo(shareInfo));
  }

  private highlightKeyword(keywords: string, searchResult: SearchResult): SearchResult {
    if (!isEmptyObject(searchResult)) {
      const reg = new RegExp(keywords, 'ig');
      ['artists', 'playlists', 'songs'].forEach(type => {
        if (searchResult[type]) {
          searchResult[type].forEach(item => {
            item.name = item.name.replace(reg, '<span class="highlight">$&</span>');
          });
        }
      });
      return searchResult;
    }
  }

  onChangeModalType(type = ModalTypes.default) {
    console.log('onChangeModalType');
    this.store$.dispatch(SetModalType({modalType: type}));
  }

  openModal(type: any) {
    console.log('openModal ', type);
    this.batchActionsServe.controlModal(true, type);
  }

  closeModal() {
    this.batchActionsServe.controlModal(false);
  }

  onLogin(params: LoginParams) {
    console.log('onLogin');
    this.showSpin = true;
    this.memberServe.login(params).subscribe(user => {
      if (user.code === 200) {
        this.user = user;
        this.closeModal();
        this.alertMessage('success', 'Log in Successed');
        this.storageServe.setStorage({
          key: 'wyUserId',
          value: user.profile.userId
        });
        this.store$.dispatch(SetUserId({userId: user.profile.userId.toString()}));
        if (params.remember) {
          this.storageServe.setStorage({
            key: 'wyRememberLogin',
            value: JSON.stringify(codeJson(params))
          });
          // localStorage.setItem('wyRememberLogin',JSON.stringify(codeJson(params)));
        } else {
          this.storageServe.removeStorage('wyRememberLogin');
          // localStorage.removeItem('wyRememberLogin');
        }
      }
      if (user.code === 502) {
        this.alertMessage('error', 'Wrong Password');
      }
      this.showSpin = false;
    }, error => {
      this.alertMessage('error', error.message || 'Login failed');
      this.showSpin = false;
    });
  }

  private alertMessage(type: string, msg: string) {
    this.message.create(type, msg);
  }

  onLogout() {
    this.memberServe.logout().subscribe(res => {
      this.user = null;
      this.storageServe.removeStorage('wyUserId');
      // localStorage.removeItem('wyUserId');
      this.alertMessage('success', 'Logout Successed');
    }, error => {
      this.alertMessage('error', error.message || 'Logout failed');
    });
    this.store$.dispatch(SetUserId({userId: ''}));
  }

  onLoadMySheets() {
    if (this.user) {
      this.memberServe.getUserSongList(this.user.profile.userId.toString()).subscribe(sheets => {
        this.mySheets = sheets.self;
        this.store$.dispatch(SetModalVisiable({modalVisiable: true}));
      });
    } else {
      this.openModal(ModalTypes.default);
    }
  }

  private watchLikeId(id: string) {
    if (id) {
      this.likeId = id;
    }
  }

  private watchModalVisiable(visiable: boolean) {
    console.log('watchModalVisiable ', visiable);
    if (this.visiable !== visiable) {
      this.visiable = visiable;
    }

  }

  private watchModalType(type: ModalTypes) {
    if (this.currentModaltype !== type) {
      if (type === ModalTypes.Like) {
        this.onLoadMySheets();
      }
      this.currentModaltype = type;
    }
  }

  private watchShareInfo(shareInfo: ShareInfo) {
    if (shareInfo) {
      if (this.user) {
        this.shareInfo = shareInfo;
        this.openModal(ModalTypes.Share);
      } else {
        this.openModal(ModalTypes.default);
      }
    }

  }

  onLikeSong(args: likeSongParamas) {
    console.log('args: ', args);
    this.memberServe.likeSong(args).subscribe(code => {
      console.log('code: ', code);
      this.closeModal();
      this.alertMessage('success', 'It\'s in your Like List now');
    }, error => {
      this.alertMessage('error', error.msg || 'Fail');
    });
  }

  onShare(args: shareParams) {
    this.memberServe.shareResource(args).subscribe(() => {
      this.alertMessage('success', 'Share Success');
      this.closeModal();
    }, error => {
      this.alertMessage('error', error.msg || 'Share Failed');
    });

  }

  onCreateSheet(sheetName: string) {
    console.log('sheetName: ', sheetName);
    this.memberServe.createSheet(sheetName).subscribe(pid => {
      this.onLikeSong({pid, tracks: this.likeId, op: 'add'});
    }, error => {
      this.alertMessage('error', 'Failed');
    });
  }

  onRegister(phone: string) {
    this.alertMessage('success', 'Register Successed');
  }
}

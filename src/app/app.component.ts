import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-types/common-types';

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

  constructor(private searchServe:SearchService){}
  onSearch(keywords:string){
    console.log("keyword: ", keywords);
    if(keywords){
      this.searchServe.search(keywords).subscribe(res =>{
        this.searchResult = res;
      });
    }else{
      this.searchResult = {};
    }
  }
}

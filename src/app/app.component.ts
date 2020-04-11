import { Component } from '@angular/core';
import { SearchService } from './services/search.service';
import { SearchResult } from './services/data-types/common-types';
import { isEmptyObject } from './utils/tools';

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
}

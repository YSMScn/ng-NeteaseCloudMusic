import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SongList } from 'src/app/services/data-types/common-types';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from 'src/app/store';
import { getMember, getLikeId } from 'src/app/store/selectors/member.selector';

@Component({
  selector: 'app-wy-layer-like',
  templateUrl: './wy-layer-like.component.html',
  styleUrls: ['wy-layer-like.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyLayerLikeComponent implements OnInit,OnChanges {
  @Input()mySheets:SongList[];
  private likeId:string;
  constructor(
    private store$:Store<AppStoreModule>
  ) {
    this.store$.pipe(select(getMember),select(getLikeId)).subscribe(id=>{
      if(id){
        this.likeId = id;
      }

    })
   }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('mySheets: ',changes['mySheets'].currentValue);
  }

  ngOnInit(): void {
  }

  onLike(id:string){

  }
}

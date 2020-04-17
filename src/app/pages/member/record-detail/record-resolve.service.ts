import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User, recordVal, UserSongList } from 'src/app/services/data-types/member-types';
import { Injectable } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';

type RecordDataType=[
  User,recordVal[]
]



@Injectable({
  providedIn: 'root',
})
export class RecordResolverService implements Resolve<RecordDataType> {
  constructor(
    private memberServe:MemberService,
    private router:Router
    ) {}

  resolve(route:ActivatedRouteSnapshot): Observable<RecordDataType>{
    const uid = route.paramMap.get('id');
    if(uid){
      return forkJoin([
        this.memberServe.getUserDetail(uid),
        this.memberServe.getUserRecord(uid),
      ]).pipe(first());
    }
    else{
      this.router.navigate(['/home']);
    }

  }
}

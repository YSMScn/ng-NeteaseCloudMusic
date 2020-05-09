import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User, recordVal, UserSongList } from 'src/app/services/data-types/member-types';
import { Injectable } from '@angular/core';
import { MemberService } from 'src/app/services/member.service';
import { Observable, forkJoin } from 'rxjs';
import { first } from 'rxjs/internal/operators';

type CentreDataType= [
  User, recordVal[], UserSongList
];



@Injectable({
  providedIn: 'root',
})
export class CentreResolverService implements Resolve<CentreDataType> {
  constructor(
    private memberServe: MemberService,
    private router: Router
    ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<CentreDataType> {
    const uid = route.paramMap.get('id');
    if (uid) {
      return forkJoin([
        this.memberServe.getUserDetail(uid),
        this.memberServe.getUserRecord(uid),
        this.memberServe.getUserSongList(uid),
      ]).pipe(first());
    } else {
      this.router.navigate(['/home']);
    }

  }
}

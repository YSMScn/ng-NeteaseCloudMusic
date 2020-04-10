import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SingerDetail } from 'src/app/services/data-types/common-types';
import { Observable } from 'rxjs';
import { SingerService } from 'src/app/services/Singer.service';


@Injectable()
export class SingerResolverService implements Resolve<SingerDetail>{
    constructor(private singerServe:SingerService) {}
    resolve(route: ActivatedRouteSnapshot):Observable<SingerDetail>  {
        const id = route.paramMap.get('id');
        return this.singerServe.getSingerDetail(id)
    }
    
}
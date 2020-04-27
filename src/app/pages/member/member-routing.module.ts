import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CentreComponent } from './centre/centre.component';
import { CentreResolverService } from './centre/centre-resolve.service';
import { RecordDetailComponent } from './record-detail/record-detail.component';
import { RecordResolverService } from './record-detail/record-resolve.service';


const routes: Routes = [{
  path:'',component:CentreComponent, data:{title:'Personal Centre'},resolve:{user:CentreResolverService}
},{
  path:'records/:id',component:RecordDetailComponent, data:{title:'Play History'},resolve:{user:RecordResolverService}
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CentreResolverService,RecordResolverService]
})
export class MemberRoutingModule { }

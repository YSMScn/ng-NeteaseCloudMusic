import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { User } from 'src/app/services/data-types/member-types';
import { MemberService } from 'src/app/services/member.service';
import { timer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.less']
})
export class MemberCardComponent implements OnInit {
  @Output() openModal = new EventEmitter<void>();
  @Input() user: User;
  point: number;
  showTip = false;
  tipTitle = '';
  constructor(
    private memberServe: MemberService,
    private message: NzMessageService,
  ) { }

  ngOnInit(): void {
  }

  onCheckin() {
    this.memberServe.checkin().subscribe(res => {
      console.log('res: ', res);
      this.tipTitle = '+' + res.point;
      this.showTip = true;
      timer(1500).subscribe(() => {
        this.showTip = false;
        this.tipTitle = '';
      });
    }, error => {
        this.alertMessage('error', error.message || 'Checkin failed');
    });
  }

  private alertMessage(type: string, msg: string) {
    this.message.create(type, msg);
  }
}

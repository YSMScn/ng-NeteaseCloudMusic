import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-wy-check-code',
  templateUrl: './wy-check-code.component.html',
  styleUrls: ['wy-check-code.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WyCheckCodeComponent implements OnInit, OnChanges {
  private phoneHideStr = '';
  formModel: FormGroup;
  showRepeatBtn = false;
  truePhoneNum = '';
  @Input()checkPassed = true;
  @Input()
  set phone(phones: string) {
    this.truePhoneNum = phones;
    const arr = phones.split('');
    arr.splice(3, 4, '****');
    this.phoneHideStr = arr.join('');
  }
  get phone() {
    return this.phoneHideStr;
  }
  @Input()timing: number;
  @Output()onCheckCode = new EventEmitter<string>();
  @Output()onRepeat = new EventEmitter<void>();
  @Output()onCheckExist = new EventEmitter<string>();
  constructor() {
    this.formModel = new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern(/\d{4}/)])
    });
    const codeControl = this.formModel.get('code');
    codeControl.statusChanges.subscribe(s => {
      if (s === 'VALID') {
        this.onCheckCode.emit(this.formModel.value.code);
      }
    });

   }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.timing) {
      this.showRepeatBtn = this.timing <= 0;
    }


  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.formModel.valid && this.checkPassed) {
      this.onCheckExist.emit(this.truePhoneNum);
    }
  }

}

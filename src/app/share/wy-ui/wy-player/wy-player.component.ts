import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wy-player',
  templateUrl: './wy-player.component.html',
  styleUrls: ['wy-player.component.less']
})
export class WyPlayerComponent implements OnInit {
  sliderValue = 35;
  bufferOffset1 = 55;
  constructor() { }

  ngOnInit(): void {
  }

}

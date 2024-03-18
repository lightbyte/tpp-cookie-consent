import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { TppBannerBlock } from '../types/tpp-banner-block';

@Component({
  selector: 'lib-tppcc-block',
  templateUrl: './tppcc-block.component.html',
  styleUrls: ['./tppcc-block.component.scss']
})
export class TppccBlockComponent implements OnInit {

  @Input() block?: TppBannerBlock;
  @Output() changedEvent = new EventEmitter<boolean>();
  
  isChecked = false;
  isOpened = false;


  constructor() { }

  ngOnInit(): void {
    if (this.block?.status == 'allow'){
      this.isChecked = true;
    }
  }

  changeValue(event: any){
    console.log("CHECK", event, this.isChecked);
    this.changedEvent.emit(this.isChecked);
  }

}

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TppccBannerComponent } from './tppcc-banner/tppcc-banner.component';
import { TPPCC_CONFIG, TppCookieConsentConfig } from './types/tpp-cookie-consent-config';
import { TppCookieConsentService } from './tpp-cookie-consent.service';
import { TppccBlockComponent } from './tppcc-block/tppcc-block.component';



@NgModule({
  declarations: [
    TppccBannerComponent,
    TppccBlockComponent
  ],
  imports:[
    FormsModule,
    CommonModule
  ]
})
export class TppCookieConsentModule {

  static forRoot(config: TppCookieConsentConfig): ModuleWithProviders<TppCookieConsentModule> {
    
    return {
      ngModule: TppCookieConsentModule,
      providers: [
        TppCookieConsentService, 
        { provide: TPPCC_CONFIG, useValue: config }
      ]
    };
  }

}

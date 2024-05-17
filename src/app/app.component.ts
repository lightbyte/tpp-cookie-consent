import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { TppCookieConsentService } from 'tpp-cookie-consent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'tpp-cookie-consent';

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  status: any[] = [];
  firstTime = true;
  v_align = "bottom";
  h_align = "right";
  center_dialog = false;
  expand_config = false;
  logger = 'logger: ';

  constructor(
    private translocoService: TranslocoService,
    private ccService: TppCookieConsentService
  ) { }


  ngOnInit() {

    console.log("INIT APP COMPONENT");
    this.initCookieConsentLib();

  }

  initCookieConsentLib() {

    this.ccService.statusChangedEvent().pipe(
      filter(value => value.length > 0),
      takeUntil(this._unsubscribeAll)
    ).subscribe(status => {
      console.log("APP COMPONENT - STATUS CHANGED");
      // this.authService.setCookieConsentStatus(status);
      // this.googleAnalyticsService.set
      this.status = status;

      this.showDialogFirstTime();
    });

    this.ccService.initLibraryEvent().pipe(
      take(1),
      takeUntil(this._unsubscribeAll)
    ).subscribe(() => {
      console.log("APP COMPONENT - LIB INITIALIZED");

      this.translocoService.selectTranslateObject("COOKIE-CONSENT")
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(trans => {
          console.log("COOKIE-CONSENT TRANSLATIONS");

          this.firstTime = true;
          this.ccService.setConfig({
            buttonText: trans.COOKIES_BUTTON_COOKIE,
            bannerTitle: trans.COOKIES_PANEL_TITLE,
            bannerText: trans.COOKIES_MESSAGE,
            bannerBlocks: [
              {
                id: "1",
                title: trans.COOKIES_PANEL_BLOCK_1_TIT,
                allwaysActive: true,
                allwaysActiveText: trans.COOKIES_PANEL_BLOCK_ACTIVE,
                description: trans.COOKIES_PANEL_BLOCK_1_DESC
              },
              {
                id: "2",
                title: trans.COOKIES_PANEL_BLOCK_2_TIT,
                description: trans.COOKIES_PANEL_BLOCK_2_DESC
              }//,
              // {
              //   id: "3",
              //   title: trans.COOKIES_PANEL_BLOCK_3_TIT,
              //   description: trans.COOKIES_PANEL_BLOCK_3_DESC
              // }
            ],
            bannerButtons: [
              { id: 'ok', text: trans.COOKIES_PANEL_DISMIS },
              { id: 'cancel', text: trans.COOKIES_PANEL_DENY },
              { id: 'config', text: trans.COOKIES_PANEL_CONFIG },
              { id: 'save', text: trans.COOKIES_PANEL_SAVE }
            ],
            bannerLinks: [
              {
                text: trans.COOKIES_TEXT,
                url: trans.COOKIES_LINK,
                isButton: true,
                btnCallback: () => this.callbackBtn()
              },
              {
                text: trans.PRIVACY_TEXT,
                url: trans.PRIVACY_LINK
              },
              {
                text: trans.NOTICE_TEXT,
                url: trans.NOTICE_LINK
              }
            ],
            h_align: this.h_align,
            v_align: this.v_align,
            center_dialog: (this.center_dialog ? true : false),
            expandConfig: (this.expand_config ? true : false)
          });

        });
      this.ccService.addCookieButton();
      console.log("APP COMPONENT - FINISH INITIALIZATION");
    });
  }

  showDialogFirstTime() {
    if (!this.firstTime) return;
    this.firstTime = false;
    
    
    let isDenyAll = true;
    this.status.forEach(val => {
      isDenyAll = isDenyAll && val.status == 'deny';
    });
    if (isDenyAll) {
      this.ccService.openPopup();
    }
  }

  showButton() {
    this.ccService.addCookieButton();
  }
  hideButton() {
    this.ccService.removeCookieButton();
  }
  showDialog() {
    this.ccService.openPopup();
  }
  hideDialog() {
    this.ccService.closePopup();
  }

  callbackBtn(){
    setTimeout(() => {
      console.log("CALLBACK WORKS!");
      this.logger = this.logger + "<br>Callback works!";
      
    }, 0);
  }

  refreshConfig(){
    this.ccService.setConfig({
      h_align: this.h_align,
      v_align: this.v_align,
      center_dialog: (this.center_dialog ? true : false),
      expandConfig: (this.expand_config ? true : false)
    });
  }

  ngOnDestroy() {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}

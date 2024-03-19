import { Component, OnInit } from '@angular/core';

import { TppCookieConsentConfig } from '../types/tpp-cookie-consent-config';
import { TppCookieConsentService } from '../tpp-cookie-consent.service';
import { TppBannerBlock } from '../types/tpp-banner-block';

@Component({
  selector: 'lib-tppcc-banner',
  templateUrl: './tppcc-banner.component.html',
  styleUrls: ['./tppcc-banner.component.scss']
})
export class TppccBannerComponent implements OnInit {

  isBtnOpen = false;
  isDlgOpen = false;
  isConfigOpen = false;

  isBtnOpenRestore = false;

  buttons = [
    { id: 'ok', text: 'OK' },
    { id: 'cancel', text: 'CANCEL' },
    { id: 'config', text: 'CONFIGURE' },
    { id: 'save', text: 'SAVE SETTINGS' }
  ];
  config!: TppCookieConsentConfig;

  constructor(
    private cookieService: TppCookieConsentService
  ) {
    this.config = this.cookieService.getConfig();
  }

  ngOnInit(): void {

    this.autoExpandConfig();

    // CONFIG
    this.cookieService.configChanged$.subscribe(() => {
      console.log("CONFIG CHANGED");
      this.config = this.cookieService.getConfig();
      this.updateButtonsLang();
    });

    // BUTTON
    this.cookieService.addButton$.subscribe(() => {
      // console.log("ADD BUTTON RECEIVED");
      this.isBtnOpen = true;
    });
    this.cookieService.removeButton$.subscribe(() => {
      // console.log("REMOVE BUTTON RECEIVED");
      this.isBtnOpen = false;
    });

    // DIALOG
    this.cookieService.openPopup$.subscribe(() => {
      // console.log("OPEN POPUP RECEIVED");
      this.cookieService.resetStatus();
      
      this.autoExpandConfig();

      this.isBtnOpenRestore = this.isBtnOpen;
      this.isDlgOpen = true;
      
      this.cookieService.sendPopupOpenedEvent();
    });
    this.cookieService.closePopup$.subscribe(() => {
      // console.log("CLOSE POPUP RECEIVED");
      this.isDlgOpen = false;
      // this.cookieService.sendPopupClosedEvent();
    });

    this.updateButtonsLang();

    this.cookieService.sendInitLibraryEvent();
  }

  public trackItem (index: number, item: TppBannerBlock) {
    return item.id + "-" + item.status;
  }

  updateButtonsLang(){
    this.buttons.forEach((value, index) => {
      this.config.bannerButtons?.forEach((newBtn) => {
        if (newBtn.id == value.id) {
          value.text = newBtn.text;
        }
      });
    });
  }

  getClasses() {
    let classes = [];

    switch (this.config.v_align) {
      case "top":
        classes.push("top");
        break;
      case "bottom":
        classes.push("bottom");
        break;
      default:
        classes.push("bottom");
    }

    switch (this.config.h_align) {
      case "left":
        classes.push("left");
        break;
      case "right":
        classes.push("right");
        break;
      default:
        classes.push("right");
    }

    if (this.config.center_dialog){
      classes.push("center-dlg");
    }

    return classes;
  }

  cookieButtonClick() {
    this.autoExpandConfig();
    this.isBtnOpenRestore = this.isBtnOpen;
    this.isDlgOpen = !this.isDlgOpen;
    this.isBtnOpen = !this.isBtnOpen;

    if (this.isDlgOpen) {
      this.cookieService.resetStatus();

      this.cookieService.sendPopupOpenedEvent();
    } else {
      this.cookieService.sendPopupClosedEvent();
    }

    // console.log("COOKIES OPEN", this.isDlgOpen);
  }

  blockChanged(block: TppBannerBlock, event: any) {
    console.log(
      "BLOCK CHANGED", 
      block.status, event, 
      this.config.bannerBlocks?.find(val => val.id == block.id)?.status
    );

    // Guardar información del evento
    block.status = event ? 'allow' : 'deny';
  }

  acceptAllBlocks(){
    this.config.bannerBlocks?.forEach(block => {
      block.status = 'allow';
    });
  }

  denyAllBlocks(){
    this.config.bannerBlocks?.forEach(block => {
      block.status = 'deny';
    });
  }

  autoExpandConfig(){
    this.isConfigOpen = false;
    if (this.config.expandConfig && this.config.expandConfig === true){
      this.isConfigOpen = true;
    }
  }

  dlgButtonClick(btnId: string) {
    switch (btnId) {
      case "ok":
        // Aceptar todo
        this.acceptAllBlocks();
        this.isDlgOpen = false;
        this.isBtnOpen = this.isBtnOpenRestore;
        this.cookieService.sendStatusChangedEvent();
        this.cookieService.sendPopupClosedEvent();
        break;
      case "cancel":
        this.isDlgOpen = false;
        this.isBtnOpen = this.isBtnOpenRestore;
        // Denegar todo
        this.denyAllBlocks();
        this.cookieService.sendStatusChangedEvent();
        this.cookieService.sendPopupClosedEvent();
        break;
      case "config":
        this.isConfigOpen = true;
        break;
      case "save":
        // Usar la configuración que ya se ha establecido
        this.cookieService.sendStatusChangedEvent();
        this.isDlgOpen = false;
        this.isBtnOpen = this.isBtnOpenRestore;
        this.cookieService.sendPopupClosedEvent();
        break;
      case "close":
        this.isDlgOpen = false;
        this.isBtnOpen = this.isBtnOpenRestore;
        this.cookieService.sendPopupClosedEvent();
        break;
    }
  }
}

import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { TPPCC_CONFIG, TppCookieConsentConfig } from './types/tpp-cookie-consent-config';
import { TppStatusChangedEvent } from './types/tpp-status-changed-event';
import { TppccBannerComponent } from './tppcc-banner/tppcc-banner.component';

const TPP_COOKIE_CONSENT_NAME = "tpp_cookie_consent_status";

@Injectable()
export class TppCookieConsentService {

  private componentRef: any = null;

  // COMMANDS
  openPopup$: Subject<any> = new Subject<any>();
  closePopup$: Subject<any> = new Subject<any>();
  addButton$: Subject<any> = new Subject<any>();
  removeButton$: Subject<any> = new Subject<any>();
  configChanged$: Subject<any> = new Subject<any>();

  // EVENTS
  initLibrary$: Subject<any> = new Subject<any>();
  popupOpened$: Subject<any> = new Subject<any>();
  popupClosed$: Subject<any> = new Subject<any>();
  statusChanged$: BehaviorSubject<TppStatusChangedEvent[]> = new BehaviorSubject<TppStatusChangedEvent[]>([]);


  constructor(
    @Inject(TPPCC_CONFIG) private config: TppCookieConsentConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {
    // Para romper la referencia cíclica entre el servicio y el banner
    setTimeout(() => this.initializeLib(), 100);
  }

  initializeLib() {

    this.updateStatusFromCookie();
    this.sendStatusChangedEvent();

    this.removeComponentFromBody();
    this.appendComponentToBody(TppccBannerComponent);

  }

  getConfig() {
    return this.config;
  }

  setConfig(newConfig: TppCookieConsentConfig) {
    console.log("NEW CONFIG UPDATED");
    Object.assign(this.config, newConfig);
    this.updateStatusFromCookie();
    this.configChanged$.next(true);
    this.sendStatusChangedEvent();
  }

  resetStatus() {
    // Inicializar el estado de los bloques
    this.config.bannerBlocks?.forEach(block => {
      block.status = block.allwaysActive ? 'allow' : block.status == 'dismiss' ? 'deny' : block.status !== undefined ? block.status : 'deny';
    });
  }

  updateStatusFromCookie() {
    console.log("UPDATE STATUS FROM COOKIES");
    // Inicializar el estado de los bloques
    this.config.bannerBlocks?.forEach(block => {
      // console.log("BLOCK STATUS 1", block);
      block.status = block.allwaysActive ? 'allow' : block.status !== undefined ? block.status : 'deny';
      // console.log("BLOCK STATUS 2", block);
    });

    // Leer la cookie de la librería para ver el estado actual de consentimiento y actualizar en consecuencia
    const statusJSON = localStorage.getItem(TPP_COOKIE_CONSENT_NAME);
    if (statusJSON != null) {
      // Establezco el status a cada bloque
      try {
        const status = JSON.parse(statusJSON);
        this.config.bannerBlocks?.forEach(block => {
          let found = false;
          status.forEach((val: any) => {
            if (val.id == block.id) {
              block.status = val.status;
              found = true;
            }
          });
        });
      } catch (error) {
        console.log("ERROR PARSEANDO COOKIE DE ESTADO", error);
      }
    }
  }
  updateCookieFromStatus() {
    // Actualizar el estado de la cookie de consentimiento

    let isDismiss = false;
    let cookie: any[] = [];

    this.config.bannerBlocks?.forEach(block => {
      cookie.push({
        id: block.id,
        status: block.status
      });
      // Si hay alguna en 'dismiss' es que se ha dado a "cancel" 
      // y deberían estar todas en 'dismiss'
      if (block.status == 'dismiss') isDismiss = true;
    });

    if (isDismiss) {
      // Limpia su cookie (La app deberá gestionar su propia mierda)
      localStorage.removeItem(TPP_COOKIE_CONSENT_NAME);

    } else {
      // Guarda las preferencias del usuario
      localStorage.setItem(TPP_COOKIE_CONSENT_NAME, JSON.stringify(cookie));
    }

    return cookie;
  }

  /* EXTERNAL COMMANDS */
  addCookieButton() { this.addButton$.next(true); }
  removeCookieButton() { this.removeButton$.next(true); }
  openPopup() { this.openPopup$.next(true); }
  closePopup() { this.closePopup$.next(true); }

  /* SEND EVENTS */
  sendInitLibraryEvent() { setTimeout(() => this.initLibrary$.next(true), 100); }
  sendPopupOpenedEvent() { this.popupOpened$.next(true); }
  sendPopupClosedEvent() { this.popupClosed$.next(true); }
  sendStatusChangedEvent() {
    // Actualizar el estado de la cookie de consentimiento
    const status = this.updateCookieFromStatus();
    console.log("SEND STATUS CHANGED EVENT", status);
    this.statusChanged$.next(status);
  }

  /* PUBLIC EVENTS */
  initLibraryEvent() { return this.initLibrary$.asObservable(); }
  popupOpenedEvent() { return this.popupOpened$.asObservable(); }
  popupClosedEvent() { return this.popupClosed$.asObservable(); }
  statusChangedEvent() { return this.statusChanged$.asObservable(); }


  /* HTML MANIPULATION */
  private appendComponentToBody(component: any) {
    // 1. Create a component reference from the component 
    this.componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    // 2. Attach component to the appRef so that it's inside the ng component tree
    this.appRef.attachView(this.componentRef.hostView);

    // 3. Get DOM element from component
    const domElem = (this.componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    // 4. Append DOM element to the body
    document.body.appendChild(domElem);
  }

  private removeComponentFromBody() {
    if (!this.componentRef) return;

    // 5. remove it from the component tree and from the DOM
    this.appRef.detachView(this.componentRef.hostView);
    this.componentRef.destroy();
    this.componentRef = null;

  }
}

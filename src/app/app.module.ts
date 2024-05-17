import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { TppCookieConsentConfig, TppCookieConsentModule } from 'tpp-cookie-consent';
import { TranslocoRootModule } from './transloco-root.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



const configTppCC:TppCookieConsentConfig = {
  buttonText: "Gestionar consentimiento",
  bannerTitle: "Gestionar el consentimiento de las cookies",
  bannerText: "Utilizamos tecnologías como las cookies para almacenar y/o acceder a la información del dispositivo. Lo hacemos para mejorar la experiencia de navegación y para mostrar anuncios (no) personalizados. El consentimiento a estas tecnologías nos permitirá procesar datos como el comportamiento de navegación o los ID's únicos en este sitio. No consentir o retirar el consentimiento, puede afectar negativamente a ciertas características y funciones.",
  bannerBlocks: [
    {id: "1", title: 'Funcional', allwaysActive: true, allwaysActiveText: 'Siempre activo', description: 'El almacenamiento o acceso técnico es estrictamente necesario para el propósito legítimo de permitir el uso de un servicio específico explícitamente solicitado por el abonado o usuario, o con el único propósito de llevar a cabo la transmisión de una comunicación a través de una red de comunicaciones electrónicas.'},
    {id: "2", title: 'Estadísticas', description: 'El almacenamiento o acceso técnico que se utiliza exclusivamente con fines estadísticos anónimos. Sin un requerimiento, el cumplimiento voluntario por parte de tu proveedor de servicios de Internet, o los registros adicionales de un tercero, la información almacenada o recuperada sólo para este propósito no se puede utilizar para identificarte.'}
    //,
    // {id: "3", title: 'Marketing', description: 'El almacenamiento o acceso técnico es necesario para crear perfiles de usuario para enviar publicidad, o para rastrear al usuario en una web o en varias web con fines de marketing similares.'}
  ],
  bannerButtons: [
    {id: 'ok', text: 'Aceptar'},
    {id: 'cancel', text: 'Cancelar'},
    {id: 'config', text: 'Ver preferencias'},
    {id: 'save', text: 'Guardar preferencias'}
  ],
  bannerLinks: [
    {text: 'Política de privacidad', url: 'https://www.agrovin.com/politica-de-privacidad/'},
    {text: 'Aviso legal', url: 'https://www.agrovin.com/aviso-legal/'}
  ],
  h_align: "right",
  v_align: "bottom"
};


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    TranslocoRootModule,
    TppCookieConsentModule.forRoot(configTppCC)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { GraphQLModule } from './apollo.config';
import { Camera } from '@ionic-native/camera';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ListTablePage } from '../pages/list-table/list-table';
import { TablesFreePage } from '../pages/tables-free/tables-free';
import { RegisterQrPage } from '../pages/register-qr/register-qr';

import { MozosService } from '../services/mozos.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ListTablePage,
    TablesFreePage,
    RegisterQrPage
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LoginPage,
    ListTablePage,
    TablesFreePage,
    RegisterQrPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    MozosService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}

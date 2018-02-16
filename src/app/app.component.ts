import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events, LoadingController, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { MozosService } from '../services/mozos.service';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LoginPage } from '../pages/login/login';
import { ListTablePage } from '../pages/list-table/list-table';
import { TablesFreePage } from '../pages/tables-free/tables-free';
import { RegisterQrPage } from '../pages/register-qr/register-qr';

export interface PageInterface {
  title: string;
  description: string;
  component: any;
  icon: string;
  badge?: boolean;
  logsOut?: boolean;
  validate?:boolean;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  //public user: User;

  pages: Array<{title: string, component: any}>;

  appPages: PageInterface[] = [
    {
      title: 'Home', description: 'Ver el Pagina Inicial',
      component: ListTablePage, icon: 'coop-usuario'
    },
    {
      title: 'List', description: 'Ver el Listas',
      component: ListPage, icon: 'coop-usuario'
    },
    {
      title: 'Lista de Mesas', description: 'Ver las mesas',
      component: ListTablePage, icon: 'coop-usuario'
    },
    {
      title: 'Registrar QR', description: 'Registrar un nuevo QR',
      component: RegisterQrPage, icon: 'coop-usuario'
    },
    {
      title: 'Salir', description: 'Salir de la aplicaci\u00f3n',
      component: LoginPage, icon: 'coop-exit', logsOut: true
    },
  ];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
    private storage: Storage, private menuCtrl: MenuController, public events: Events,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController,
    private mozosService: MozosService) {
    this.initializeApp();

    this.listenToEnterEvents();
    
    this.mozosService.isLoggedIn().then((loggedIn) => {
      platform.ready().then(() => {
        if(loggedIn) {
          // this.mozosService.hasWaiter().then((user) => {
          //   this.user = user;
          // });
          this.rootPage = ListTablePage;
        } else {
          this.menuCtrl.enable(false);
          this.rootPage = LoginPage;
        }

        setTimeout(() => { this.splashScreen.hide(); }, 2000);
      });
    });
  }
  

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  listenToEnterEvents() {
    this.events.subscribe('user:login', () => {
      //let loader = this.loadingCtrl.create({ dismissOnPageChange: true });
      //loader.present();
      this.nav.setRoot(HomePage).then(() => {
      //this.userService.getUser().then((user) => {
        //this.user = user;
        //loader.dismiss().then(() => {});
      //});
      }).catch(() => {});
    });
    this.events.subscribe('user:logout', () => {
      let loader = this.loadingCtrl.create();
      loader.present();
      this.nav.setRoot(LoginPage).then(() => {
        loader.dismiss().then(() => {});
      }).catch(() => {});
    });
  }
}

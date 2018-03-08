import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { QRService } from '../../services/qr.service';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-register-qr',
  templateUrl: 'register-qr.html',
  providers: [QRScanner, QRService]
})
export class RegisterQrPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private qrScanner: QRScanner,
              private Qr: QRService, public alertCtrl: AlertController){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterQrPage');
  }

  register(tableNumber){
  	var ionApp = <HTMLElement>document.getElementsByTagName("ion-app")[0];

    console.log('Preparando escaneo'); //Esto deberia encargarse de escanear el codigo y retornar el id
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log("qr escaneado:", text);

            this.Qr.register(text,tableNumber).then((data)=>{
              console.log(data)
              if (data === 1) {
                this.showAlert();
              }
              else{
                if (data === 2) {
                  this.alertError("El QR ya existe")
                }
                else{
                  this.alertError("Error al cargar el QR")
                }
              }
            });
            ionApp.style.display = 'block';
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            
            //this.joinTable(text);
          });

          // show camera preview
          ionApp.style.display = 'none';
          this.qrScanner.show();

          // wait for user to scan something, then the observable callback will be called
          // resolve(toRet);
        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Felicitaciones',
      subTitle: 'Qr cargado correctamente',
      buttons: ['OK']
    });
    alert.present();
  }

  alertError(msg){
    let alert = this.alertCtrl.create({
      title: 'Ups!!',
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

  tableNumber(){
    let alert = this.alertCtrl.create({
      title: 'Número de Mesa',
      inputs: [
        {
          name: 'numero',
          placeholder: 'Número de Mesa',
          type:'number'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: data => {
            console.log(data);
            // this.ts.updateBeers(table.id,table.beerCount+Number(data.cantidad));
            this.register(Number(data.numero));
          }
        }
      ]
    });
    alert.present();
  }

}

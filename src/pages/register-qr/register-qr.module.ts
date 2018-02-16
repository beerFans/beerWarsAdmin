import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterQrPage } from './register-qr';

@NgModule({
  declarations: [
    RegisterQrPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterQrPage),
  ],
})
export class RegisterQrPageModule {}

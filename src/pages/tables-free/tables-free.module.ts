import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TablesFreePage } from './tables-free';

@NgModule({
  declarations: [
    TablesFreePage,
  ],
  imports: [
    IonicPageModule.forChild(TablesFreePage),
  ],
})
export class TablesFreePageModule {}

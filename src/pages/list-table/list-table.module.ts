import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListTablePage } from './list-table';
import { PipesModule } from '../../pipes/pipes.module'


@NgModule({
  declarations: [
    ListTablePage,

  ],
  imports: [
    IonicPageModule.forChild(ListTablePage),
    PipesModule
  ],
})
export class ListTablePageModule {}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'
import { TableService } from '../../services/table.service';
import { Apollo } from 'apollo-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, JOIN_TABLE_MUTATION, 
        NEW_TABLE_SUBSCRIPTION, UPDATE_TABLE_SUBSCRIPTION,AllTableQueryResponse, 
        DELETE_TABLE_SUBSCRIPTION } from '../../app/graphql';
import {Subscription} from 'rxjs/Subscription';
import { AlertController } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-list-table',
  templateUrl: 'list-table.html',
  providers: [TableService]
})
export class ListTablePage {
  public allTables: Table[] = [];
  public activeTables: Table[] = [];
  public loading: boolean = true;
  shownTable: Table;
  subscriptions: Subscription[] = [];
  field = "beerCount";
  orderType = 'NONE';


  constructor(public navCtrl: NavController, public navParams: NavParams, private ts: TableService, private apollo: Apollo,
              private alertCtrl: AlertController
             ){
  }

  ionViewDidLoad() {
    this.ts.getTables().then((response) => {
      let bar = <any>{ response };
      // console.log(bar);
      this.allTables = bar.response.data.allTables;
      console.log("mesas", this.allTables);
      this.loading = false;
    });

    const allTablesQuery = this.apollo.watchQuery<AllTableQueryResponse>({
      query: ALL_TABLES_QUERY
    });

    allTablesQuery.subscribeToMore({
      document: NEW_TABLE_SUBSCRIPTION,
      updateQuery: (previous: AllTableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table) {
          console.log("hay nueva mesa");
          let newAllTables = [
            (<any>subscriptionData).data.Table.node,
            ...previous.allTables
            ];
            // newAllTables = this.sort(newAllTables);
          //newAllTables = newAllTables.filter(table => table.qrID != null );
          return {
            ...previous,
            allTables: newAllTables,
            //activeTables: newAllTables
          }
        }
        else {
          return {
            ...previous
          }
        }
      }
    });

    allTablesQuery.subscribeToMore({
      document: UPDATE_TABLE_SUBSCRIPTION,
      updateQuery: (previous: AllTableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table) {
          console.log("mesa modificada");
          let newAllTables = [
            ...previous.allTables
          ]
          //newAllTables = this.sort(newAllTables);

          //let newActiveTables = newAllTables.filter(table => table.qrID != null );
          
          return {
            ...previous,
            allTables: newAllTables,
            //activeTables: newActiveTables
          }
        }
        else {
          return {
            ...previous
          }
        }
      }
    });

    allTablesQuery.subscribeToMore({
      document: DELETE_TABLE_SUBSCRIPTION,
      updateQuery: (previous: AllTableQueryResponse, { subscriptionData }) => {
        console.log(subscriptionData);
        if ((<any>subscriptionData).data.Table) {
          console.log("mesa eliminada", (<any>subscriptionData).data);
          let index = this.allTables.findIndex(x=> x.id === (<any>subscriptionData).data.Table.previousValues.id)
          let newAllTables = [...this.allTables];
          console.log("index", index);
          if(index !== -1){
            newAllTables.splice(index,1);
          }
          console.log("New all tables",newAllTables);
          return {
            ...previous,
            allTables: newAllTables,
            //activeTables: newAllTables
          }
        }
        else {
          return {
            ...previous
          }
        }
      }
    });



const querySubscription = allTablesQuery.valueChanges.subscribe((response) => {
  this.allTables = response.data.allTables;
  this.loading = response.data.loading;
  this.activeTables = response.data.allTables.filter(table => table.qrID != null );
});

  this.subscriptions = [...this.subscriptions, querySubscription];
    }

  goToTable(table) {
    this.navCtrl.push('TablePage', { 'table': table });
  }

  sort(tables) {
    tables.sort(function(a,b) {
      if(a['beerCount'] > b['beerCount']) {
        return -1;
      }
      else if(a['beerCount'] < b['beerCount']) {
        return 1;
      }
      else {
        return 0;
      }
    });
    return tables;
  }

  // addBeer(table){
  //   console.log("Agregando cerveza");
  //   let cant = this.presentPrompt();
  //   console.log("cant", cant);
  // }

  deleteBeer(table){
    console.log("Quitando cerveza");
    this.ts.updateBeers(table.id,table.beerCount-1);
  }

  closeTable(table){
    this.ts.closeTable(table.id);
  }

  deleteAll() {
    let mesas = [
      ...this.allTables
    ]
    mesas = this.sort(mesas);
    this.ts.createWinner(mesas[0]);
    this.ts.deleteAll(this.allTables);
    // this.allTables = [];
  }

  addBeer(table) {
    let alert = this.alertCtrl.create({
      title: 'Agregar',
      inputs: [
        {
          name: 'cantidad',
          placeholder: 'Cantidad',
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
            this.ts.updateBeers(table.id,table.beerCount+Number(data.cantidad));
            //return data;
          }
        }
      ]
    });
    alert.present();
  }

}

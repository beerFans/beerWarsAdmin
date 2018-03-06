import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Table } from '../../app/types'
import { TableService } from '../../services/table.service';
import { Apollo } from 'apollo-angular';
import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, JOIN_TABLE_MUTATION, 
        NEW_TABLE_SUBSCRIPTION, UPDATE_TABLE_SUBSCRIPTION,AllTableQueryResponse, 
        DELETE_TABLE_SUBSCRIPTION } from '../../app/graphql';
import {Subscription} from 'rxjs/Subscription';


@IonicPage()
@Component({
  selector: 'page-list-table',
  templateUrl: 'list-table.html',
  providers: [TableService]
})
export class ListTablePage {
  public allTables: Table[] = [];
  public loading: boolean = true;
  shownTable: Table;
  subscriptions: Subscription[] = [];
  field = "beerCount";
  orderType = 'NONE';


  constructor(public navCtrl: NavController, public navParams: NavParams, private ts: TableService, private apollo: Apollo) {

  }

  ionViewDidLoad() {
    this.ts.getTables().then((response) => {
      let bar = <any>{ response };
      // console.log(bar);
      this.allTables = bar.response.data.allTables;
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
            newAllTables = this.sort(newAllTables);
          return {
            ...previous,
            allTables: newAllTables
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
          newAllTables = this.sort(newAllTables);
          return {
            ...previous,
            allTables: newAllTables
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
            allTables: newAllTables
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

  addBeer(table){
    console.log("Agregando cerveza");
    this.ts.updateBeers(table.id,table.beerCount+1);
  }

  deleteBeer(table){
    console.log("Quitando cerveza");
    this.ts.updateBeers(table.id,table.beerCount-1);
  }

  closeTable(table){
    this.ts.closeTable(table.id);
  }

  deleteAll() {
    this.ts.deleteAll(this.allTables);
    // this.allTables = [];
  }

}

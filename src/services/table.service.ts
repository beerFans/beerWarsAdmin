import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Events } from 'ionic-angular';
import { Table } from '../app/types'

import { CREATE_TABLE_MUTATION, ALL_TABLES_QUERY, TABLE_QR_QUERY, JOIN_TABLE_MUTATION, CreateTableMutationResponse } from '../app/graphql';
import { UPDATE_BEERS_TABLE, DELETE_TABLE_MUTATION, CLOSE_TABLE_MUTATION, CREATE_WINNERTABLE_MUTATION, JOIN_WINNER_TABLE_MUTATION } from '../app/graphql';


@Injectable()
export class TableService {
  
  constructor(private apollo: Apollo, private events: Events) {
  }

  getTables() {
    return new Promise((resolve, reject) => {
      console.log("Buscando mesas");
      this.apollo.watchQuery<any>({
        query: ALL_TABLES_QUERY
      }).valueChanges.subscribe((response) => {
        // console.log(response.data.allTables);
        resolve(response);
      });
    });
  }

  updateBeers(tableId, beerCount){
    this.apollo.mutate({
      mutation: UPDATE_BEERS_TABLE,
      variables: {
        id: tableId,
        beerCount: beerCount
      }
    }).subscribe((response)=>{
      console.log(response);
    })
  }

  closeTable(tableId){
    this.apollo.mutate({
      mutation: CLOSE_TABLE_MUTATION,
      variables: {
        id:tableId,
      }
    }).subscribe((response)=>{
      console.log(response)
    })
  }

  deleteAll(tables) {
    for (let table of tables) {
      this.apollo.mutate({
        mutation: DELETE_TABLE_MUTATION,
        variables: {
          id: table.id,
        }
      }).subscribe((response)=> {
        console.log("Delete table");
        console.log(response.data);
      })
    }
  }

  createWinner(winner:Table){
    this.apollo.mutate({
        mutation: CREATE_WINNERTABLE_MUTATION,
        variables: {
          name: winner.name,
          beerCount:winner.beerCount, 
          picture: winner.picture
        }
      }).subscribe((response)=> {
        if (response.data.createWinnerTable) {
          for(let user of winner.users){
            this.apollo.mutate({
              mutation: JOIN_WINNER_TABLE_MUTATION,
              variables: {
                userId: user.id,
                tableId: response.data.createWinnerTable.id
              }
            }).subscribe((response)=> {
              console.log("winner table creado");
              console.log(response.data);
            })
          }
        }
        console.log("winner table creado");
        console.log(response.data);
      })
  }
  
}

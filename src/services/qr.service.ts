import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

import { CREATE_QR_MUTATION } from '../app/graphql';

@Injectable()
export class QRService {
  
  constructor(private apollo: Apollo) {
  }

  register(description, tableNumber){
  	return new Promise((resolve, reject)=>{
      this.apollo.mutate({
        mutation: CREATE_QR_MUTATION,
        variables: {
          description: description,
          nroMesa: tableNumber
        },
        refetchQueries: ['TableQRQuery']
      }).subscribe((response)=>{
        console.log(response);
        resolve(1);
      },(err) => {
        if (err.toString().indexOf('unique') !== -1) {
          // this.auth.logout(this.router.url);
          resolve(2);
        } else {
          console.log(err);
          resolve(3);
        }
      });
    })
  }

}
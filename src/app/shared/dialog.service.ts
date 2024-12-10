import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogExampleComponent } from '../dialog-example/dialog-example.component';
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog() {
   return this.dialog.open(DialogExampleComponent,{
      width: '390px',
      panelClass: 'confirm-dialog-container',
      disableClose: true
    });
  }
}

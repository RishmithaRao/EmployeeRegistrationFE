import { Component, Inject, inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  styleUrls: ['./dialog-example.component.css']
})
export class DialogExampleComponent {

  constructor(public dialogref: MatDialogRef<DialogExampleComponent>){

  }
  closeDialog(){
this.dialogref.close();
  }
}

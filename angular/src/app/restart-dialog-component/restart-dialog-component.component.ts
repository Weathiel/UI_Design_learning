import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-restart-dialog-component',
  templateUrl: './restart-dialog-component.component.html',
  styleUrls: ['./restart-dialog-component.component.css']
})
export class RestartDialogComponentComponent implements OnInit {

  htmlTitle = '';
  htmlHeader = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    if (data != null) {
      if (data.title != null) {
        this.htmlTitle = data.title;
      }
      if (data.header != null) {
        this.htmlHeader = data.header;
      }
    }
  }

  ngOnInit(): void {
  }


}

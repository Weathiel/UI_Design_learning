import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular';

  private myFunctionCallSource = new Subject();

  @ViewChild("sidenav")
  sidenav !: MatSidenav;

  onSidenavClose() {
    this.sidenav.close();
  }

  toggleSidenav() {
    if (!this.sidenav.opened) {
      this.sidenav.open();
    } else {
      this.sidenav.close();
    }
  }
}

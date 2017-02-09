import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

const enum PropretyType_domestic {sudio, flat, house}
const enum PropertyType_commercial {office}
const enum PropertyType {PropertyType_domestic, PropertyType_commercial};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
}

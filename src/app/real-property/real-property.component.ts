import { Component, OnInit } from '@angular/core';

const enum PropertyType {domestic, commercial};
const enum PropertySubType {studio, flat, house, office};

export interface RealProperty {
  sAddress?: string;
  ePropertyType?: PropertyType;
  ePropertySubType: PropertySubType;
  nTotalSquare: number;
  nNumberOfRooms: number;
  nNumberOfBathRooms: number;
}

@Component({
  selector: 'app-real-property',
  templateUrl: './real-property.component.html',
  styleUrls: ['./real-property.component.css']
})
export class RealPropertyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

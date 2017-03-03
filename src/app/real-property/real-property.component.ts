import { Component, OnInit } from '@angular/core';

const enum PropertyType {domestic, commercial};
const enum PropertySubType {studio, flat, house, office};

export interface RealProperty {
  gma_place_id?: string;
  address_line_1?: string;
  address_line_2?: string;
  propertyType?: PropertyType;
  propertySubType: PropertySubType;
  totalSquare: number;
  ceilingHeight: number;
  numberOfRooms: number;
  numberOfBathRooms: number;
  bathRoomType: number;
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

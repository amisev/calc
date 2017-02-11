import { Component, OnInit, NgZone, Input, ViewChild } from '@angular/core'; 
import { FormGroup, FormControl, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RealProperty } from '../real-property/real-property.component'
import { MapsAPILoader } from 'angular2-google-maps/core';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})

export class CalculatorComponent implements OnInit {
  public errorMessage: string;

  public calculatorForm: FormGroup;
  public submitted: boolean;
  public events: any[] = [];

  @ViewChild('inputElement') inputElement;

  /*standing data goes here*/
  public propertyTypes = [
    { value: 0, display: 'Студия'},
    { value: 1, display: '1'},
    { value: 2, display: '2'},
    { value: 3, display: '3'},
    { value: 4, display: '4'},
    { value: 5, display: '5'},
  ]

  public bathRoomTypes = [
    { value: 0, display: 'Совмещ'},
    { value: 1, display: 'Раздел'}
  ]

  public clickedPropertyButtonValue: number = 1;
  public clickedBathRoomButtonValue: number = 1;
  
  constructor(
    private _fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.calculatorForm = this._fb.group({
      address: ['', <any>Validators.required],
      propertyType: [0, <any>Validators.required],
      propertySubType: [0, <any>Validators.required],
      totalSquare: ['', [<any>Validators.required, <any>Validators.pattern('^[0-9]*')]],
      numberOfRooms: [1, <any>Validators.required],
      numberOfBathRooms: [1, <any>Validators.required],
      ceilingHeight: [2.6, [<any>Validators.required, <any>Validators.pattern('^[0-9]*.?[0-9]*')]],
      bathRoomType: [0, <any>Validators.required]
    });

    this.subscribeToFormChanges();
    // google maps autocomplete
    this.mapsAPILoader.load().then(() => {
      let cityBound_Moscow = new google.maps.LatLngBounds(
        new google.maps.LatLng(55.378233, 37.221680),
        new google.maps.LatLng(55.960636, 38.287354)
      );
      let autocomplete = new google.maps.places.Autocomplete(
        this.inputElement.nativeElement,
        { 
          bounds: cityBound_Moscow,
          types: ["address"],
          componentRestrictions: {country: 'ru'}
        }
      );
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          //verify result
          if (place.geometry === undefined || place.geometry === null || place.address_components['street_number'] === false) {
            return;
          }
          (<FormControl>this.calculatorForm.controls['address']).setValue(place.formatted_address)
        });
      });
    });
    
  }

  save(model: RealProperty, isValid: boolean) {
    this.submitted = true;
    // check if model is valid
    console.log(model, isValid);
  }

  propertyTypeBtnClicked = (propertyTypeClicked) => {
    console.log('propertyTypeBtnClicked');
    let value = propertyTypeClicked.value; 
    this.clickedPropertyButtonValue = value;
    if (value == 0) {
      // set property sub type to studio, number of rooms to 1
      (<FormControl>this.calculatorForm.controls['propertySubType']).setValue(0);
      (<FormControl>this.calculatorForm.controls['numberOfRooms']).setValue(1);
    } else {
      (<FormControl>this.calculatorForm.controls['propertySubType']).setValue(1);
      (<FormControl>this.calculatorForm.controls['numberOfRooms']).setValue(<number>value);
    }
  }

  bathRoomTypeBtnClicked = (bathRoomTypeClicked) => {
    console.log('bathRoomTypeBtnClicked'); 
    this.clickedBathRoomButtonValue = bathRoomTypeClicked.value;
    (<FormControl>this.calculatorForm.controls['bathRoomType']).setValue(bathRoomTypeClicked.value);
  }
  
  subscribeToFormChanges(){
    const calculatorFormValueChanges$ = this.calculatorForm.valueChanges;
    calculatorFormValueChanges$.subscribe(x=>this.events.push({event: 'Status changed', object: x}));
  }
  
}

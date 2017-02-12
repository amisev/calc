import { Component, OnInit, NgZone, Input, ViewChild } from '@angular/core'; 
import { FormGroup, FormControl, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RealProperty } from '../real-property/real-property.component'
import { MapsAPILoader } from 'angular2-google-maps/core';
import { InputMaskModule } from 'primeng/primeng';

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
  public CALCULATOR_FORM_STATE = {
    GENERAL_INFORMATION: 'GeneralInformation', 
    ADDITIONAL_OPTIONS: 'AdditionalOptions',
    CONTACT_INFORMATION: 'ContactInformation',
    FINAL_STATE: 'finalState'
  };

  public propertyTypes = [
    { value: 0, display: 'Студия'},
    { value: 1, display: '1'},
    { value: 2, display: '2'},
    { value: 3, display: '3'},
    { value: 4, display: '4'},
    { value: 5, display: '5'},
  ];

  public bathRoomTypes = [
    { value: 0, display: 'Совмещ'},
    { value: 1, display: 'Раздел'}
  ];

  public clickedPropertyButtonValue: number = 1;
  public clickedBathRoomButtonValue: number = 1;
  
  constructor(
    private _fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.calculatorForm = this._fb.group({
      currentState: [''],
      currentStateGroup: this.initCalculatorStatesFormGroup()
    });

    this.setCurrentState(this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION);

    this.initMapsAPILoader();
  }

  initCalculatorStatesFormGroup() {
    // initialize calculator states
    const group = this._fb.group({
      generalInformationState: this._fb.group(this.initGeneralInformationFormModel()),
      additionalOptionsState: this._fb.group(this.initAdditionalOptionsFormModel()),
      contactInformationState: this._fb.group(this.initContactInformationFormModel()),
      finalState: this._fb.group(this.initFinalFormModel())
    });
    
    return group;
  }

  initGeneralInformationFormModel() {
    // initialize general information model
    const model = {
      address: ['', <any>Validators.required],
      propertyType: [0, <any>Validators.required],
      propertySubType: [0, <any>Validators.required],
      totalSquare: ['', [<any>Validators.required, <any>Validators.pattern('^[0-9]*')]],
      ceilingHeight: [2.6, [<any>Validators.required, <any>Validators.pattern('^[0-9]*.?[0-9]*')]],
      numberOfRooms: [1, <any>Validators.required],
      numberOfBathRooms: [1, <any>Validators.required],
      bathRoomType: [0, <any>Validators.required]
    }
    return model;
  } 

  initAdditionalOptionsFormModel() {
    // initialize additional options model
    const model = {
      designRequired: [0],
      entranceDoorRequired: [0]
    }
    return model;
  }
  
  initContactInformationFormModel() {
    // initialize contact information model
    const model = {
      email: ['', [<any>Validators.required, <any>Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')]],
      phone: ['', <any>Validators.required]
    }
    return model;
  }

  initFinalFormModel() {
    // initialize contact information model
    const model = {
      message: ['Информация успешно направлена']
    }
    return model;
  }

  setCurrentState(state: string) {
    // update current state of model
    const stateCtrl: FormControl = (<any>this.calculatorForm).controls.currentState;
    stateCtrl.setValue(state);
  }

  initMapsAPILoader() {
    // google maps API initialization
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

          const generalInformationStateCtrl = (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState;
          const addressCtrl = generalInformationStateCtrl.controls.address;
          addressCtrl.setValue(place.formatted_address);
        });
      });
    });
  }

  save(model: RealProperty, isValid: boolean) {
    this.submitted = true;
    // check if model is valid
    console.log(model, isValid);
  }
  
  // global form handlers

  forwardBtnClicked = (currentState) => {
    /* additional options currently passed
    if (currentState === this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.valid) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.ADDITIONAL_OPTIONS);
    }
    */
    if (currentState === this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.valid) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION);
    }

    if (currentState === this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.contactInformationState.valid) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.FINAL_STATE);
    }
  }

  backwardBtnClicked = (currentState) => {
    /* additional options currently passed
    if (currentState === this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.valid) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.ADDITIONAL_OPTIONS);
    }
    */
    if (currentState === this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION);
    }

    if (currentState === this.CALCULATOR_FORM_STATE.FINAL_STATE) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION);
    }
  }

  // general infromation form state handlers
  propertyTypeBtnClicked = (propertyTypeClicked) => {

    let value = propertyTypeClicked.value; 
    this.clickedPropertyButtonValue = value;

    const generalInformationStateCtrl = (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState;
    const propertySubTypeCtrl = generalInformationStateCtrl.controls.propertySubType;
    const numberOfRoomsCtrl = generalInformationStateCtrl.controls.numberOfRooms;
    
    if (value == 0) {
      // set property sub type to studio, number of rooms to 1
      propertySubTypeCtrl.setValue(0);
      numberOfRoomsCtrl.setValue(1);
    } else {
      propertySubTypeCtrl.setValue(1);
      numberOfRoomsCtrl.setValue(<number>value);
    }
  }

  bathRoomTypeBtnClicked = (bathRoomTypeClicked) => {

    this.clickedBathRoomButtonValue = bathRoomTypeClicked.value;
    const generalInformationStateCtrl = (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState;
    const bathRoomTypeCtrl = generalInformationStateCtrl.controls.bathRoomType;
    bathRoomTypeCtrl.setValue(bathRoomTypeClicked.value);
  }


 
  /*  
  subscribeToFormChanges(){
    const calculatorFormValueChanges$ = this.calculatorForm.valueChanges;
    calculatorFormValueChanges$.subscribe(x=>this.events.push({event: 'Status changed', object: x}));
  }
  */
  
}

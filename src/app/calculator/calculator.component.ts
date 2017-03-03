import { Component, OnInit, NgZone, Input, ViewChild, ChangeDetectorRef } from '@angular/core'; 
import { FormGroup, FormControl, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RealProperty } from '../real-property/real-property.component'
import { MapsAPILoader } from 'angular2-google-maps/core';
import { InputMaskModule } from 'primeng/primeng';

import { ApolloQueryObservable } from 'apollo-angular';
import { PeService, IPackage, IPackages, ICalculatedPrice, ICalculatedPrices, IUser } from '../pe.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
// import { DataService } from '../data.service';


@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css'],
  providers: [ PeService ]
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
    PACKAGES: 'Packages',
    ADDITIONAL_OPTIONS: 'AdditionalOptions',
    CONTACT_INFORMATION: 'ContactInformation',
    FINAL_STATE: 'finalState'
  };

  public propertyTypes = [
    { value: 0, display: 'Студия', disabled: false},
    { value: 1, display: '1', disabled: false},
    { value: 2, display: '2', disabled: false},
    { value: 3, display: '3', disabled: false},
    { value: 4, display: '4', disabled: true},
    { value: 5, display: '5', disabled: true},
  ];

  public bathRoomTypes = [
    { value: 0, display: 'Совмещенный'},
    { value: 1, display: 'Раздельный'}
  ];

  public clickedPropertyButtonValue: number = 1;
  public clickedBathRoomButtonValue: number = 1;
  
  public defaultPackageName: string = 'Default'
  public selectedPackageName: string = this.defaultPackageName;
  public selectedPackagePrice: number = 0.0;
  public selectedPackageDescription: string = '';

  public packagesList = [];
  public packageName = '';
  public packageDescription = '';

  public calculatedPriceData: ICalculatedPrices = [ { packageName: this.defaultPackageName, totalCost: 0.0, costOfWork: 0.0, costOfMaterial: 0.0} ];
  
  public packages: IPackages = [];
  public selectedPackage: IPackage;

  public formErrors = {
    'totalSquare': '',
    'ceilingHeight': '' 
  }

  public validationMessages = {
    'totalSquare': {
      'required': 'необходимо ввести площадь',
      'minValueError': 'площадь не может быть менее 20 м2',
      'maxValueError': 'площадь не может быть более 1000 м2'
    },
    'ceilingHeight': {
      'required': 'необходимо ввести высоту',
      'minValueError': 'высота не может быть менее 2.6 м',
      'maxValueError': 'высота не может быть более 3.4 м'
    }
  }

  constructor(
    private _fb: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private ps: PeService,
    private cd: ChangeDetectorRef
    // private ds: DataService
  ) { }

  ngOnInit() {
    this.calculatorForm = this._fb.group({
      currentState: [''],
      currentStateGroup: this.initCalculatorStatesFormGroup()
    });

    this.setCurrentState(this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION);

    this.initMapsAPILoader();

    this.subscribeToFormStateChanges();
  }

  initCalculatorStatesFormGroup() {
    // initialize calculator states
    const group = this._fb.group({
      generalInformationState: this._fb.group(this.initGeneralInformationFormModel()),
      packagesState: this._fb.group(this.initPackagesFormModel()),
      additionalOptionsState: this._fb.group(this.initAdditionalOptionsFormModel()),
      contactInformationState: this._fb.group(this.initContactInformationFormModel()),
      finalState: this._fb.group(this.initFinalFormModel())
    });
    
    return group;
  }

  initGeneralInformationFormModel() {
    // initialize general information model
    const model = {
      //address: ['', <any>Validators.required],
      gma_place_id: [''],
      address_line_1: [''],
      address_line_2: [''],
      propertyType: [0, <any>Validators.required],
      propertySubType: [0, <any>Validators.required],
      totalSquare: ['', [<any>Validators.required, <any>Validators.pattern('^[0-9]*'),  this.validateTotalSquare]],
      ceilingHeight: [2.6, [<any>Validators.required, <any>Validators.pattern('^[0-9]*.?[0-9]*'), this.validateCeilingHeight]],
      numberOfRooms: [1, <any>Validators.required],
      numberOfBathRooms: [1, <any>Validators.required],
      bathRoomType: [0, <any>Validators.required]
    }
    return model;
  } 

  initPackagesFormModel() {
    // initialize packages model
    this.ps.getPackages(true)
        .subscribe(
          data => {
            this.packages = data;
            this.selectedPackage = <IPackage>this.packages[0];
            if ((this.packages == undefined) || (this.packages.length == 0)) {
              const packageGrp = (<any>this.calculatorForm).controls.currentStateGroup.controls.packagesState;
              packageGrp.controls.packageName.setValue(this.defaultPackageName);
            } else {
              const packageGrp = (<any>this.calculatorForm).controls.currentStateGroup.controls.packagesState;
              packageGrp.controls.packageName.setValue(this.packages[0].Name);
            }
          },
          error => console.log(error)
        );

    const model = {
      packageName: ['', <any>Validators.required],
      packageDescription: [''],
      userNotes: ['']
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
      name:  ['', <any>Validators.required],
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
          generalInformationStateCtrl.controls.gma_place_id.setValue(place.place_id);
          generalInformationStateCtrl.controls.address_line_1.setValue(place.formatted_address);
        });
      });
    });
  }

  save(model: RealProperty, isValid: boolean) {
    this.submitted = true;
    // check if model is valid
    // console.log(<RealProperty>model, isValid);
  }
  
  // global form handlers

  forwardBtnClicked = (currentState) => {
    if (currentState === this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.valid) {
      this.ps.getPrice(<RealProperty>(<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.value)
        .subscribe(
          (result) => {
            this.calculatedPriceData = result;
            this.selectedPackagePrice = this.getPackagePrice(this.selectedPackageName)[0].totalCost;
            this.cd.markForCheck();
            },
          (error) => {
            console.log(error)
          });
      this.setCurrentState(this.CALCULATOR_FORM_STATE.PACKAGES);
    }

    if (currentState === this.CALCULATOR_FORM_STATE.PACKAGES && (<any>this.calculatorForm).controls.currentStateGroup.controls.packagesState.valid) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION);
    }

    if (currentState === this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.contactInformationState.valid) {
      this.ps.confirmOrder(
        <RealProperty>(<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.value,
        <IUser>(<any>this.calculatorForm).controls.currentStateGroup.controls.contactInformationState.value,
        this.getPackagePrice(this.selectedPackageName)[0])
        .subscribe(
          (result) => {
            // console.log(result);
            this.cd.markForCheck();
            },
          (error) => {
            console.log(error)
          });
      this.setCurrentState(this.CALCULATOR_FORM_STATE.FINAL_STATE);
    }
  }

  backwardBtnClicked = (currentState) => {
    /* additional options currently passed
    if (currentState === this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION && (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState.valid) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.ADDITIONAL_OPTIONS);
    }
    */
    if (currentState === this.CALCULATOR_FORM_STATE.PACKAGES) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION);
    }

    if (currentState === this.CALCULATOR_FORM_STATE.CONTACT_INFORMATION) {
      this.setCurrentState(this.CALCULATOR_FORM_STATE.PACKAGES);
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
    try {
      this.clickedBathRoomButtonValue = bathRoomTypeClicked.value;
      if (bathRoomTypeClicked.disabled != true) {
        const generalInformationStateCtrl = (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState;
        const bathRoomTypeCtrl = generalInformationStateCtrl.controls.bathRoomType;
        bathRoomTypeCtrl.setValue(bathRoomTypeClicked.value);
      }
    } catch (e) {
      console.log(e.status);
    }
  }

  subscribeToFormStateChanges() {
    try {
      const formStateChanges$ = (<any>this.calculatorForm).valueChanges;
      formStateChanges$.subscribe(x => {
        /*
        // implement in later releases
        if (x.currentState == this.CALCULATOR_FORM_STATE.GENERAL_INFORMATION) {
          const control = (<any>this.calculatorForm).controls.currentStateGroup.controls.generalInformationState;
          // validate generalInformationState
          for (const field in this.formErrors) {
            // clear previous error message
            this.formErrors[field] = '';
            if (control && !control.valid) {
              console.log(control.errors);
              const messages = this.validationMessages[field];
              for (const key in control.errors) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }
          }
        }
        */
        // get price for selected package
        this.selectedPackageName = x.currentStateGroup.packagesState.packageName;
        this.selectedPackageDescription = x.currentStateGroup.packagesState.packageDescription;
        this.selectedPackagePrice = this.getPackagePrice(this.selectedPackageName)[0].totalCost;
        this.selectedPackage = this.getPackageByName(this.selectedPackageName)[0];
      });
    } catch (e) {
      console.log(e.status);
    }
  }

  /*
  subscribeToSelectedPackageChanges() {
    try {
      const selectedPackageChanges$ = (<any>this.calculatorForm).controls.currentStateGroup.controls.packagesState.valueChanges;
      selectedPackageChanges$.subscribe(x => {
        this.selectedPackageName = x.packageName;
        if (this.getPackagePrice(this.selectedPackageName)[0] === undefined) {
          this.selectedPackagePrice = 0;
        } else {
          this.selectedPackagePrice = this.getPackagePrice(this.selectedPackageName)[0].totalCost;
        }
      });
    } catch (e) {
      console.log(e.status);
    }
  }
 */

  getPackageByName(packageName) {
    let result = this.packages.filter((package_) => {
      return package_.Name === packageName  
      });
    // return default price
    if ((result == undefined) || (result.length == 0)) {
      return <IPackages> [{ Name: this.defaultPackageName, NameDisplay: '', IsActual: false, Description: '' }]
    } else {
      return result
    }
  }

  getPackagePrice(packageName) {
    let result = this.calculatedPriceData.filter((price) => {
      return price.packageName === packageName  
      });
    // return default price
    if ((result == undefined) || (result.length == 0)) {
      return <ICalculatedPrices> [{ packageName: packageName, totalCost: 0.0, costOfWork: 0.0, costOfMaterial: 0.0 }]
    } else {
      return result
    }
  }

  // validators

  validateTotalSquare(c: FormControl) {
    if (Number(c.value) < 20 || Number(c.value) > 1000) {
      return { valueError: {valid: false} }
    }
    /*
    if (Number(c.value) < 20) {
      return { minValueError: {valid: false} }
    }
    
    if (Number(c.value) > 1000) {
      return { maxValueError: {valid: false} }
    }
   */
  }

  validateCeilingHeight(c: FormControl) {
    if (Number(c.value) < 2.6 || Number(c.value) > 3.4) {
      return { valueError: {valid: false} }
    }
    /*
    if (Number(c.value) < 2.6) {
      return { minValueError: {valid: false} }
    }
    if (Number(c.value) > 3.4) {
      return { maxValueError: {valid: false} }
    }
   */
  }
}

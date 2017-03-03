import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { AgmCoreModule } from "angular2-google-maps/core";
import { AngularFireModule } from 'angularfire2';
import { InputMaskModule } from 'primeng/primeng';
import { MaterialModule } from '@angular/material';

import { CalculatorComponent } from './calculator/calculator.component';
import { RealPropertyComponent } from './real-property/real-property.component';

import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({ apiKey: environment.places_,
                           libraries: ['places']
    }),
    HttpModule,
    JsonpModule,
    InputMaskModule,
    MaterialModule,
  ],
  declarations: [AppComponent, CalculatorComponent, RealPropertyComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { AppRoutingModule, routedComponents } from './app-routing.module';
import { AgmCoreModule } from "angular2-google-maps/core";
import { AngularFireModule } from 'angularfire2';

import { CalculatorComponent } from './calculator/calculator.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { RealPropertyComponent } from './real-property/real-property.component';

import { environment } from '../environments/environment';

export const firebaseConfig = environment.firebase_;

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AgmCoreModule.forRoot({ apiKey: environment.places_,
                           libraries: ['places']
    }),
    HttpModule,
    JsonpModule,
    AppRoutingModule
  ],
  declarations: [AppComponent, CalculatorComponent, RealPropertyComponent, routedComponents, AboutComponent, HomeComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

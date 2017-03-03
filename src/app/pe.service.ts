import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import { environment } from '../environments/environment';
import { RealProperty } from './real-property/real-property.component'

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

export interface ICalculatedPrice {
  packageName: string,
  totalCost: number,
  costOfWork: number,
  costOfMaterial: number
}

export interface ICalculatedPrices extends Array<ICalculatedPrice> {}

export interface IPackage {
  Name: string,
  NameDisplay: string,
  IsActual: boolean,
  Description: string
}

export interface IPackages extends Array<IPackage> {}

export interface IUser {
  name: string,
  email: string,
  phone: string
}

@Injectable()
export class PeService {
  private packagesUrl = environment.api_url_ + '/pe_packages/'
  private peUrl = environment.api_url_ + '/pe/'
  private orderUrl = environment.api_url_ + '/order/'

  constructor(private http: Http) { }

  getPackages(isActual:boolean) {
    return this.http
      .get(this.packagesUrl)
      .map((response) => {
        let data = response.json();
        return JSON.parse(data) || {}
      })
      .catch(this.errorHandler);
  }

  // http://stackoverflow.com/questions/33675155/creating-and-returning-observable-from-angular-2-service 
  getPrice(realProperty: RealProperty) {
    let headers = new Headers({ 'Content-Type': 'text/plain' });
    let options = new RequestOptions({ headers: headers });
    let params = new URLSearchParams();
    params.set('totalSquare', realProperty.totalSquare.toString());
    params.set('ceilingHeight', realProperty.ceilingHeight.toString());
    params.set('numberOfRooms', realProperty.numberOfRooms.toString());
    params.set('bathRoomType', realProperty.bathRoomType.toString());
    params.set('propertySubType', realProperty.propertySubType.toString());
    
    options.search = params;
    
    return this.http
      .get(this.peUrl, options)
      .map((response) => {
        let data = response.json();
        return JSON.parse(data) || {}
      })
      .catch(this.errorHandler);
  }

  confirmOrder(realProperty: RealProperty, user: IUser, price: ICalculatedPrice) {
    let headers = new Headers({ 'Content-Type': 'text/plain' });
    let options = new RequestOptions({ headers: headers });

    return this.http
      .post(this.orderUrl, { realProperty, user, price }, options)
      .map((response) => {
        let data = response.json();
        return JSON.parse(data) || {}
      })
      .catch(this.errorHandler)
  }
  errorHandler(error: Response | any) {
    let errMsg: String;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}

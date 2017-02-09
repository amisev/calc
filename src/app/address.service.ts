import { Injectable } from '@angular/core';
import { Http, Jsonp, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { environment } from '../environments/environment';

interface IGMAResponse{
  description: string;
  place_id: string;
}

@Injectable()
export class AddressService {
  // private mapsApiUrl: string = 'https://maps.googleapis.com/maps/api/place/queryautocomplete/json?';
  private mapsApiUrl: string = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?';
  private key: string = environment.places_;
 
  constructor(private http: Http, private jsonp: Jsonp) { }

  private getParameters (input): string {
    return 'key=' + this.key + '&input=' + input + '&types=address';
  }

  getAddresses (input): Observable<any[]> {
    return this.jsonp.get(this.mapsApiUrl + this.getParameters(input))
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log(body);
    return body
  }

  private handleError (error: Response | any) {
    let errMsg: string;
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

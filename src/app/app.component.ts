import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Subscription } from 'rxjs';
import 'rxjs/add/operator/pairwise';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {

  public isNavCollapsed: boolean = true;

  private _routeScrollPositions: {[url: string]: number}[] = [];
  private _subscriptions: Subscription[] = [];

  constructor(private router: Router){
  }

  ngOnInit() {
   // scroll to previous page position
   this._subscriptions.push(
     // save or restore scroll position on route change
     this.router.events.pairwise().subscribe(([prevRouteEvent, currRouteEvent]) => {
       if (prevRouteEvent instanceof NavigationEnd && currRouteEvent instanceof NavigationStart) {
        // url path without parameters
        let urlPath = (prevRouteEvent.urlAfterRedirects || prevRouteEvent.url).split(';', 1)[0];
        this._routeScrollPositions[urlPath] = window.pageYOffset;
       }
       if (currRouteEvent instanceof NavigationEnd){
         // in some cases it need timeout
         setTimeout(() => {
           // url path without parameters
          let urlPath = (currRouteEvent.urlAfterRedirects || currRouteEvent.url).split(';', 1)[0];
          window.scrollTo(0, this._routeScrollPositions[urlPath] || 0);
         }, 0);
       }
     })
   ); 
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { AboutComponent } from './about/about.component';

const routes: Routes = [
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      path: 'home',
      component: HomeComponent 
    },
    {
      path: 'calculator',
      component: CalculatorComponent 
    },
    {
      path: 'about',
      component: AboutComponent
    },
    {
      path: '**',
      redirectTo: '/home',
      pathMatch: 'full'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [ HomeComponent, CalculatorComponent, AboutComponent ];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PreviewComponent } from './pages/preview/preview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: "full"
  },
  {
    path: 'home',
    component: HomeComponent
  },
  // {
  //   path: 'home-preview',
  //   component: PreviewComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

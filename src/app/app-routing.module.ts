import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PreviewComponent } from './pages/preview/preview.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutComponent } from './pages/school/layout/layout.component';
import { AddSchoolComponent } from './pages/school/add-school/add-school.component';
import { ListSchoolComponent } from './pages/school/list-school/list-school.component';
import {StudentListComponent} from "./pages/school/student-list/student-list.component"


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path:'school',
    component:LayoutComponent,
    children:[
     {
      path:'add-school',
      component:AddSchoolComponent
     },
     {
      path:'add-school/:id',
      component:AddSchoolComponent
     },
     {
      path:'list-school',
      component:ListSchoolComponent
     },
     {
      path:'student-list/:id',
      component:StudentListComponent
     }
    ]
  }
  // {
  //   path: 'home-preview',
  //   component: PreviewComponent
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),HttpClientModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }

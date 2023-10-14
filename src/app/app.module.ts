import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgPrimeModule } from './ng-prime/ng-prime.module';
import { PreviewComponent } from './pages/preview/preview.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TokenInterceptorInterceptor } from './token-interceptor.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutComponent } from './pages/school/layout/layout.component';
import { AddSchoolComponent } from './pages/school/add-school/add-school.component';
import { ListSchoolComponent } from './pages/school/list-school/list-school.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {QRCodeModule} from 'angularx-qrcode'
import { ClipboardModule } from 'ngx-clipboard';
import { StudentListComponent } from './pages/school/student-list/student-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PreviewComponent,
    LayoutComponent,
    AddSchoolComponent,
    ListSchoolComponent,
    StudentListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgPrimeModule,
    SweetAlert2Module.forRoot(),
    SweetAlert2Module,
    SweetAlert2Module.forChild({ /* options */ }),
    BrowserAnimationsModule,
    QRCodeModule,
    ClipboardModule,
    DragDropModule

  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass:TokenInterceptorInterceptor,multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(private http: HttpClient) { }

  // users API
  createUser(data: any): Observable<any> {
    return this.http.post("http://localhost:5000/v1/users", data)
  }
  uploadToAws(data: any): Observable<any> {
    return this.http.post("http://localhost:5000/v1/users/upload-profile-aws", data)
  }
  generateAcknowledgement(data:any):Observable<any>{
    return  this.http.post('http://localhost:5000/v1/users/generate-acknowledgement',data,{ responseType: 'blob' })
  }

// school API
  createSchool(data: any): Observable<any> {
    return this.http.post("http://localhost:5000/school", data)
  }
  updateSchool(id:any,data: any): Observable<any> {
    return this.http.put(`http://localhost:5000/school/${id}`, data)
  }
  getSchoolDetails():Observable<any>{
    return  this.http.get('http://localhost:5000/school')
  }
  getSchoolDetail(id:any):Observable<any>{
    return  this.http.get(`http://localhost:5000/school/${id}`)
  }
  getSchoolList():Observable<any>{
    return  this.http.get('http://localhost:5000/school/list')
  }
  changeStatus(data:any):Observable<any>{
    return  this.http.post('http://localhost:5000/school/change-status',data)
  }

  getStudentList(data:any):Observable<any>{
    return  this.http.post('http://localhost:5000/school/student-list',data)
  }


}

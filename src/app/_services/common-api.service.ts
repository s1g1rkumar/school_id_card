import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonApiService {

  constructor(private http: HttpClient) { }

  createUser(data: any): Observable<any> {
    return this.http.post("http://localhost:5000/v1/users", data)
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class MyserviceService {

  constructor(private _http: HttpClient) { }

  submitRegister(body:any){
    return this._http.post('http://localhost:443/api/auth/register', body,{
      observe:'body'
    });
  }

  login(body:any){
    return this._http.post('http://localhost:443/api/auth/login', body,{
      observe:'body'
    });
  }

  getUserName() {
    return this._http.get('http://localhost:443/users/username', {
      observe: 'body',
      params: new HttpParams().append('token', localStorage.getItem('token'))
    });
  }

}

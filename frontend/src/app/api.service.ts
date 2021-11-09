import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Users } from "./users";
import { HttpHeaders, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  url: string;
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: HttpClient) {
    this.url = "http://localhost:8080/api/users/";
  }

  addUser(data: Users): Observable<any> {
    return this.http.post(this.url, data).pipe(catchError(this.errorMgmt));
  }

  updateUser(id, data): Observable<any> {
    let API_URL = `${this.url}/${id}`;
    return this.http
      .put(API_URL, data, { headers: this.headers })
      .pipe(catchError(this.errorMgmt));
  }

  getUsers() {
    return this.http.get(this.url);
  }

  getUsersById(id) {
    return this.http.get(this.url + id);
  }

  deleteUsers(id) {
    return this.http.delete(this.url + id);
  }
  // this.httpClient.delete(this.url + endPoints).subscribe(data => {
  //   console.log(data);
  // });

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = "";
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}

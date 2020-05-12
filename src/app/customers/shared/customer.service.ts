// SERVICES folder

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

import { ICustomer } from '../shared/customer'; // or customer.model.ts

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

const apiUrl = `${environment.apiUrl}/api/customers`;

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomers (): Observable<ICustomer[]> {
    return this.http.get<ICustomer[]>(apiUrl)
      .pipe(
        tap(_ => console.log('fetched customers')),
        catchError(this.handleError<ICustomer[]>('getCustomers', []))
      );
  }

  getCustomer(id: number): Observable<ICustomer> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<ICustomer>(url).pipe(
      tap(_ => console.log(`fetched customer id=${id}`)),
      catchError(this.handleError<ICustomer>(`getCustomer id=${id}`))
    );
  }

  addCustomer (customer): Observable<ICustomer> {
    return this.http.post<ICustomer>(apiUrl, customer, httpOptions).pipe(
      tap((newCustomer: ICustomer) => console.log(`added customer w/ id=${newCustomer.id}`)),
      catchError(this.handleError<ICustomer>('addCustomer'))
    );
  }

  updateCustomer (id, customer): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, customer, httpOptions).pipe(
      tap(_ => console.log(`updated customer id=${id}`)),
      catchError(this.handleError<any>('updateCustomer'))
    );
  }

  deleteCustomer (id): Observable<ICustomer> {
    const url = `${apiUrl}/${id}`;

    return this.http.delete<ICustomer>(url, httpOptions).pipe(
      tap(_ => console.log(`deleted customer id=${id}`)),
      catchError(this.handleError<ICustomer>('deleteCustomer'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}




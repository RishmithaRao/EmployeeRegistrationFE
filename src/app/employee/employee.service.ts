import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule, HttpErrorResponse, HttpParams } from '@angular/common/http';  
import { Observable, throwError, of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { Employee } from './employee'; 
import { PaginationControlsComponent } from 'ngx-pagination';

type NewType = Observable<Employee>;

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeesUrl = 'http://localhost:7064/api/';  
  
  constructor(private http: HttpClient) { }  
  
  // getEmployees(): Observable<Employee[]> {  
  //   const httpOptions = {
  //     headers: new HttpHeaders({ 
  //      'Access-Control-Allow-Origin': '*'
  //     })};
 
  //   var result = this.http.get<Employee[]>(this.employeesUrl + 'GetEmployees');
  //   return result;
  // }  
  getEmployees(page: number, pageSize: number, searchTerm: string = ''): Observable<{ employees: Employee[], total: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (searchTerm) {
      params = params.set('searchTerm', searchTerm);
    }

    return this.http.get<{ employees: Employee[]; total: number }>(this.employeesUrl, { params });
  }

  getEmployeesList(page: number, size: number, searchTerm: string): Observable<any> {
    const params = new HttpParams()
      .set('pageSize', size.toString())
      .set('pageNumber', page.toString())
      .set('searchTerm', searchTerm || '');
    
    return this.http.get<any>(this.employeesUrl + 'GetEmployeesPagination', { params });
  }

  getEmployee(id: string | undefined | null): Observable<Employee> {  
    if (id === '') {  
      return of(this.initializeEmployee());  
    }  
    const url = `${this.employeesUrl + 'getEmployee'}/${id}`;  
    return this.http.get<Employee>(url)  
      .pipe(  
        catchError(this.handleError)  
      );  
  }  
  
  createEmployee(employee: Employee): any {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    return this.http.post<Employee>(this.employeesUrl + 'Employee/Create', employee, { headers: headers })  
      .pipe(  
        //catchError(this.handleError)  
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            // Handle the 400 Bad Request error
            console.log('Bad Request Error:', error.error);
          }
          return throwError(error);
        })
      );  
  }  
  
  deleteEmployee(id: string | undefined): Observable<{}> {  
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    const url = `${this.employeesUrl + 'Employee/Delete'}/${id}`;  
    return this.http.delete<Employee>(url, { headers: headers })  
      .pipe(  
        catchError(this.handleError)  
      );  
  }  
  
  updateEmployee(employee: Employee): Observable<Employee> {  
    debugger;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });  
    const url = this.employeesUrl + 'Employee/Update';  
    return this.http.put<Employee>(url, employee, { headers: headers })  
      .pipe(  
        map(() => employee),  
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            // Handle the 400 Bad Request error
            console.log('Bad Request Error:', error.error);
          }
          return throwError(error);
        })
      );  
  }  
  


  private handleError(err: any) {  
    let errorMessage: string;  
    if (err.error instanceof ErrorEvent) {  
      errorMessage = `An error occurred: ${err.error.message}`;  
    } else {  
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;  
    }  
    console.error(err);  
    return throwError(errorMessage);  
  }  
  
  private initializeEmployee(): Employee {  
    return {  
      id: 'null',  
      name: 'null',  
      address: 'null',  
      gender: 'null',  
      company: 'null',  
      designation: 'null',  
      city: 'null',
      email: "null",
      contact: "null"  
    };  
  } 
}

import { Component, OnInit } from '@angular/core';    
import { Employee } from '../employee';  
import { EmployeeService } from '../employee.service';  
import { throwError } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner"; 
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../shared/dialog.service';
import { DialogExampleComponent } from '../../dialog-example/dialog-example.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit  {
  pageTitle = 'Employee List';    
  filteredEmployees: Employee[] = [];    
  employees: Employee[] = []; 
  searchText: string = '';
  searchTerm: string = '';
  errorMessage = '';   
    
  employeesList = [];
  currentPage = 1;
  pageSize = 5;
  totalEmployees = 0;
  loading: boolean = false;
  
  constructor(private employeeService: EmployeeService,
    private SpinnerService: NgxSpinnerService,  private dialog: MatDialog, private dialogservice: DialogService
    ) { }    
  
    
  ngOnInit(): void {   
    this.loadEmployees();
  }    
  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getEmployeesList(this.currentPage, this.pageSize, this.searchTerm.trim()).subscribe({
      next: (data) => {
        this.employees = data.employees;
        this.totalEmployees = data.totalEmployees;
        this.loading = false;
      
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.loading = false;
      }
  });
  }
  onSearchChange() {
    this.loadEmployees();
  }
  


  goToPage(page: number): void {
    this.currentPage = page;
    this.loadEmployees();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalEmployees / this.pageSize);
  }
    

  private handleError(err: any) {  
    let errorMessage: string;  
    if (err.error instanceof ErrorEvent) {  
      errorMessage = `An error occurred: ${err.error.message}`;  
    } else {  
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;  
    }  
    console.error(err);   
    return throwError(errorMessage, );  
  }  

  deleteEmployee(id: string | undefined, name: string | undefined, city: string | undefined): void { 
   
   
      this.dialogservice.openDialog().afterClosed().subscribe((result) => {
        if(result){
          this.loading= true;
        
          this.employeeService.deleteEmployee(id) 
             
          .subscribe(    
            () => {this.loading= false;
              this.loadEmployees();
              },


            (error: any) => { this.loading= false;
              this.errorMessage = <any>error; 
              } 
          );  
        }
      });
       
  }    
    
}  
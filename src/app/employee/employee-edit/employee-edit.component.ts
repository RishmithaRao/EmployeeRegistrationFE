import { Component, OnInit, OnDestroy } from '@angular/core';    
import { FormGroup, FormBuilder, Validators } from '@angular/forms';    
import { Subscription } from 'rxjs';    
import { ActivatedRoute, Router } from '@angular/router';    
import { Employee } from '../employee';  
import { EmployeeService } from '../employee.service';  
import { MatDialog } from '@angular/material/dialog';
//import { GenericValidator } from 'src/app/shared/genericvalidator';  
import { NgxSpinnerService } from "ngx-spinner"; 
@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.css']
})
export class EmployeeEditComponent implements OnInit, OnDestroy  {
  pageTitle = 'Employee Edit';    
  errorMessage: string;    
  employeeForm: FormGroup;    
  tranMode: string;    
  employee: Employee;
  currentPage = 1;
  pageSize = 5; 
  loading: boolean = false;   
  
  private sub: Subscription;    
  displayMessage: { [key: string]: string } = {};    
  private validationMessages: { [key: string]: { [key: string]: string } };  
  contact : string;
  constructor(private fb: FormBuilder,    
    private route: ActivatedRoute,    
    private router: Router,    
    private employeeService: EmployeeService,
     private dialog: MatDialog,
     private SpinnerService: NgxSpinnerService
    ) {    
   
    this.validationMessages = {    
      name: {    
        required: 'Employee name is required.',    
        minlength: 'Employee name must be at least three characters.',    
        maxlength: 'Employee name cannot exceed 50 characters.'    
      },    
      city: {    
        required: 'Employee city name is required.',    
      }    
    };  
    this.sub = new Subscription();  
    this.employee = {};
    this.tranMode ="";
    this.errorMessage =";"
    this.employeeForm = this.fb.group({
     
      contact: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
    });
    this.contact="";
    //this.genericValidator = new GenericValidator(this.validationMessages);    
  }    

  submitForm() {
    if (this.employeeForm.valid) {
      // Perform your form submission logic here
      console.log('Form submitted:', this.employeeForm.value);
    } else {
      // Mark controls as touched to trigger validation messages
      this.markControlsAsTouched();
    }
  }
  markControlsAsTouched() {
    Object.values(this.employeeForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  ngOnInit() {    
    this.tranMode = "new";    
    this.employeeForm = this.fb.group({    
      name: ['', [Validators.required,    
      Validators.minLength(3),    
      Validators.maxLength(50)    
      ]],    
      address: '',    
      city: ['', [Validators.required]],    
      gender: ['', [Validators.required]],    
      company: '',    
      designation: '',
      email:['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(15), Validators.pattern("^[0-9]*$")]]
    });    
    
    this.sub = this.route.paramMap.subscribe(    
      params => {    
        const id = params.get('id');    
        const city = params.get('city');    
        if (id == '0') {    
          const employee: Employee = { id: "0", name: "", address: "", gender: "", company: "", designation: "", city: "", email: "", contact: "" };    
          this.displayEmployee(employee);    
        }    
        else {    
          this.getEmployee(id, city);    
        }    
      }    
    );    
  }  
 
  isValidNumber(): boolean {
    const regex = /^[0-9]*$/;
    var result = regex.test(this.contact);
    if(!result){
      this.contact = "";
    }
    return result;
  }
  ngOnDestroy(): void {    
    this.sub.unsubscribe();    
  }    
  getEmployee(id: string | undefined | null, city: string | undefined | null): void {   
    this.loading=true;   
    this.employeeService.getEmployee(id).subscribe(    
        (employee: Employee) => {this.loading=false; 
          this.displayEmployee(employee);
          },

        (error: any) => {this.loading=false;
          this.errorMessage = <any>error; 
        }
      );
    
  }  
    
    
  displayEmployee(employee: Employee): void { 
    if (this.employeeForm) {    
      this.employeeForm.reset();    
    }    
    this.employee = employee;    
    if (this.employee.id == '0') {    
      this.pageTitle = 'Add Employee';    
    } else {    
      this.pageTitle = `Edit Employee: ${this.employee.name}`;    
    }    
    this.employeeForm.patchValue({    
      name: this.employee.name,    
      address: this.employee.address,    
      gender: this.employee.gender,    
      company: this.employee.company,    
      designation: this.employee.designation,    
      city: this.employee.city,
      email: this.employee.email,
      contact: this.employee.contact
    });    
  }    
    
  deleteEmployee(): void {    
    // if (this.employee.id == '0') {    
    //   this.onSaveComplete();    
    // } else {    
      if (confirm(`Are you sure want to delete this Employee: ${this.employee.name}?`)) {  
        this.loading=true;  
        this.employeeService.deleteEmployee(this.employee.id)    
          .subscribe(    
            () => {this.loading=false;
              this.onSaveComplete(); },   
            (error: any) => { this.loading=false; this.errorMessage = <any>error } 
          );    
      }    
    // }    
  }    
    
  saveEmployee(): void {     
    console.log(this.employeeForm);
    if (this.employeeForm.valid) {    
      if (this.employeeForm.dirty) {  
         
        const p = { ...this.employee, ...this.employeeForm.value };    
        if (p.id === '0') {    
          
          this.loading=true;
          console.log("ess",p);
         var result = this.employeeService.createEmployee(p).subscribe(    
              () => {this.loading=false;
                this.onSaveComplete()

              },    
              (error: any) => { this.loading=false; 
                this.errorMessage = <any>error;  }  
            );    
            console.log(result);
        } else {    
          this.loading=true; 
          this.employeeService.updateEmployee(p)    
            .subscribe(    
              () => this.onSaveComplete(),    
              (error: any) =>{this.loading=false; 
                 this.errorMessage = <any>error ; }
            );    
        }    
      } else {    
        this.onSaveComplete();    
      }    
    } else {    
       
      this.errorMessage = 'Please correct the validation errors.';    

    }   
  }    
    
  onSaveComplete(): void {    
    
    this.employeeForm.reset();    
    this.router.navigate(['/employees']);  
   
  }   
}

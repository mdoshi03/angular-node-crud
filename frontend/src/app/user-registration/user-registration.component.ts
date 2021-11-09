import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "../api.service";
import { MatDialog } from "@angular/material";
import { DialogboxComponent } from "../dialogbox/dialogbox.component";

@Component({
  selector: "app-user-registration",
  templateUrl: "./user-registration.component.html",
  styleUrls: ["./user-registration.component.scss"],
})
export class UserRegistrationComponent implements OnInit {
  // email = new FormControl("", [Validators.required, Validators.email]);

  userForm: FormGroup;
  getparamid: any;
  hide: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getparamid = this.route.snapshot.paramMap.get("id");

    if (this.getparamid) {
      this.api.getUsersById(this.getparamid).subscribe((res: any) => {
        // console.log(res, "res==>");
        this.userForm.patchValue({
          firstName: res.firstName,
          lastName: res.lastName,
          email: res.email,
          password: res.password,
        });
      });
    }

    this.userForm = new FormGroup({
      firstName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      lastName: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9]+@miraclesoft.com"),
      ]),

      password: new FormControl("", [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  public checkError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  };

  submit() {
    console.log(this.userForm.value);
    console.log("this.userForm.value");

    this.api.addUser(this.userForm.value).subscribe((data) => {
      console.log(data);
    });
    // FormGroupDirective.resetForm();
    this.dialog.open(DialogboxComponent, {
      data: {
        title: "User Registered",
        person: {
          name: this.userForm.value.firstName,
          email: this.userForm.value.email,
        },
      },
    });
    this.userForm.reset();
    Object.keys(this.userForm.controls).forEach((key) => {
      this.userForm.controls[key].setErrors(null);
    });
  }

  userUpdate() {
    console.log("updatedform");

    if (this.userForm.valid) {
      this.api
        .updateUser(this.getparamid, this.userForm.value)
        .subscribe((res) => {
          console.log(res, "resupdated");
        });
    }
    this.dialog.open(DialogboxComponent, {
      data: {
        title: "User Updated",
        person: {
          name: this.userForm.value.firstName,
          email: this.userForm.value.email,
        },
      },
    });
  }
}

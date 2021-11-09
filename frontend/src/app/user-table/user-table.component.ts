import { Component, ViewChild, OnInit } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-user-table",
  templateUrl: "./user-table.component.html",
  styleUrls: ["./user-table.component.scss"],
})
export class UserTableComponent implements OnInit {
  displayedColumns: string[] = [
    "id",
    "state",
    "firstName",
    "lastName",
    "email",
    "actions",
  ];
  dataSource: MatTableDataSource<Users>;

  constructor(private api: ApiService, public router: Router) {}
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.getUsers();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getUsers() {
    this.api.getUsers().subscribe((data: []) => {
      this.dataSource.data = data;
    });
  }

  editUsers(id) {
    console.log(id);
    this.router.navigate(["register", id]);
  }

  deleteUsers(id, i) {
    // const index = this.dataSource.data.indexOf(id);
    // this.dataSource.data.splice(index, 1);
    // this.dataSource._updateChangeSubscription();
    if (
      confirm(
        "Are you sure you want to delete user: " +
          this.dataSource.data[i].firstName
      )
    ) {
      this.api.deleteUsers(id).subscribe((data) => {
        console.log(data);
      });
      this.dataSource.data = this.dataSource.data.filter(
        (item, index) => index !== i
      );
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };
}

export interface Users {
  firstName: string;
  state: string;
  lastName: string;
  email: string;
  id: number;
}

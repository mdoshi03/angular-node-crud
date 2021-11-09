import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { UserRegistrationComponent } from "./user-registration/user-registration.component";
import { UserTableComponent } from "./user-table/user-table.component";

const routes: Routes = [
  { path: "", redirectTo: "/home", pathMatch: "full" },
  { path: "home", component: UserTableComponent },
  { path: "register", component: UserRegistrationComponent },
  { path: "register/:id", component: UserRegistrationComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
  standalone: false,
})
export class FooterComponent {
  constructor(private router: Router) {}

  navigateToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}

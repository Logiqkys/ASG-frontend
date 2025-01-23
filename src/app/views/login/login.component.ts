import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  standalone: false,
})
export class LoginComponent {
  constructor(private router: Router) {}

  // Hardcoded users
  users = [
    { username: "admin1", password: "admin" },
    { username: "user1", password: "user" },
  ];

  // Login form fields
  username = "";
  password = "";

  // Login message
  loginMessage = "";

  // Login method
  login() {
    console.log("Entered Username:", this.username);
    console.log("Entered Password:", this.password);

    // Debugging log to check the hardcoded users
    console.log("Hardcoded Users:", this.users);

    // Find the user
    const user = this.users.find(
      (u) => u.username === this.username && u.password === this.password
    );

    if (user) {
      console.log("Login Successful:", user);
      // Store the username in sessionStorage
      sessionStorage.setItem("username", this.username);

      // Navigate to the chat page
      this.router.navigate(["/chat"]);
    } else {
      console.error(
        "Login Failed: No matching user found with the given credentials."
      );
      this.loginMessage = "Invalid username or password.";
    }
  }
}

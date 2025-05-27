import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  constructor(private msalService: MsalService, private router: Router,  private http: HttpClient) { }

  ngOnInit(): void {
    // Ensure MSAL instance is fully initialized
    this.initializeMsal();
  }

  // Explicit function to initialize the MSAL instance
  async initializeMsal() {
    if (!this.msalService.instance) {
      console.error('MSAL instance is not initialized.');
      return;
    }

    // Wait until the MSAL instance is fully initialized
    try {
      await this.msalService.instance.initialize();
      console.log('MSAL instance is initialized and ready to use.');
    } catch (error) {
      console.error('Failed to initialize MSAL:', error);
    }
  }

  login() {
    // Ensure the MSAL instance is initialized before logging in
    if (!this.msalService.instance) {
      console.error('MSAL instance is not initialized.');
      return;
    }

    // Call the loginPopup method to log in
    this.msalService.loginPopup().subscribe(
      (response: AuthenticationResult) => {
        console.log('Login successful:', response);
        this.msalService.instance.setActiveAccount(response.account);
        // Safely extract user details from the response
        const userEmail = response.account.username || 'Unknown email';
        const userName = response.account.idTokenClaims?.name ||
                         response.account.idTokenClaims?.preferred_username ||
                         response.account.username || 'Unknown user';
        const accessToken = response.accessToken;

        // Send the user data and token to the backend API
        this.sendToBackend( response.account );

        this.router.navigate(['depotDoc']); // Navigate after login
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  }

  sendToBackend(user: any) {
    const apiUrl = 'https://localhost:7001/api/User/register'; // Your backend API URL
    const token = user.idToken;

    console.log("je suis dans send to back");

    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`, // Token for authentication
        'Content-Type': 'application/json'
    });

    // Prepare the body to match the expected User model
    const body = {
        username: user.name, 
        email: user.username,
        accessToken: token 
    };

    this.http.post(apiUrl, body, { headers }).subscribe(
        (response : any) => {
          if (response.message == 'login success') {
            console.log('User data sent to backend successfully:', response);
          } else if (response.message == 'registration successful') {
            console.log('User registred:', response);
            
          }  
        }, 
        (error) => {
          if (error.status == 401) {
            console.error('Failed to send user data to backend:', error);
            
          }else{
            console.log("error sending data", error)
          }
        }
    );
  }
}

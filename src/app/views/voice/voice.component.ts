import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Device, Call } from "@twilio/voice-sdk";

@Component({
  selector: "app-voice",
  templateUrl: "./voice.component.html",
  styleUrls: ["./voice.component.css"],
  standalone: false,
})
export class VoiceComponent {
  public device: Device | null = null; // Changed to public
  public activeCall: Call | null = null; // Changed to public
  public callStatus: string = "Disconnected";
  public incomingCall: boolean = false;
  public isConnected: boolean = false;
  public callerNumber: string | null = null;
  public phoneNumber: string = "";
  public callDuration: number = 0; // Call duration in seconds
  private callTimer: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.setupTwilioDevice();
  }

  // Setup Twilio Device with Access Token
  setupTwilioDevice(): void {
    const identity = "web_user";

    this.http
      .post("https://asg-backend-dwi1.onrender.com/voice/token", { identity })
      .subscribe(
        (response: any) => {
          this.device = new Device(response.token);

          // Register event handlers
          this.device.on("registered", () => {
            console.log("Device registered");
            this.callStatus = "Ready to make/receive calls";
            this.isConnected = true;
          });

          this.device.on("error", (error: any) => {
            console.error("Twilio Device Error:", error);
            this.callStatus = `Error: ${error.message}`;
          });

          this.device.on("connect", (call: Call) => {
            console.log("Call connected");
            this.activeCall = call;
            this.callStatus = "On Call";

            // Start call duration timer
          });

          this.device.on("disconnect", (call: Call) => {
            console.log("Call disconnected");
            if (this.activeCall === call) {
              this.activeCall = null;
            }
            this.callStatus = "Call Ended";

            // Stop call timer
            this.stopCallTimer();
          });

          this.device.on("incoming", (call: Call) => {
            console.log("Incoming call from:", call.parameters["From"]);
            this.incomingCall = true;
            this.callerNumber = call.parameters["From"];
            this.activeCall = call;

            // Auto reject after 30 seconds
            setTimeout(() => {
              if (this.incomingCall) {
                this.declineCall();
              }
            }, 30000);
          });

          // Register the device
          this.device.register();
        },
        (error) => {
          console.error("Error fetching Twilio token:", error);
          this.callStatus = "Failed to connect to Twilio";
        }
      );
  }

  makeCall(): void {
    if (!this.device) {
      alert("Device not ready.");
      return;
    }

    const params = { To: `+63${this.phoneNumber}` };
    console.log("Attempting to make a call to:", this.phoneNumber);

    this.device
      .connect({ params })
      .then((call: Call) => {
        this.activeCall = call;
        this.callStatus = `Calling ${this.phoneNumber}`;
      })
      .catch((error) => {
        console.error("Error starting the call:", error);
        this.callStatus = "Failed to start the call.";
      });
  }

  acceptCall(): void {
    if (this.activeCall) {
      this.activeCall.accept();
      this.incomingCall = false;
      this.callStatus = "On Call";

      // Start call duration timer
    }
  }

  declineCall(): void {
    if (this.activeCall) {
      this.activeCall.reject();
      this.incomingCall = false;
      this.callerNumber = null;
      this.callStatus = "Call Rejected";
      this.activeCall = null;
    }
  }

  endCall(): void {
    if (this.activeCall) {
      this.activeCall.disconnect();
      this.activeCall = null;
      this.callStatus = "Call Ended";

      // Stop call timer
      this.stopCallTimer();
    }
  }

  addToInput(value: string): void {
    this.phoneNumber += value;
  }

  // Start the call timer

  // Stop the call timer
  private stopCallTimer(): void {
    if (this.callTimer) {
      clearInterval(this.callTimer);
      this.callTimer = null;
    }
  }
}

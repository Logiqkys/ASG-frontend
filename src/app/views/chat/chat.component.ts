import { Component, OnInit } from "@angular/core";
import { io, Socket } from "socket.io-client";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
  standalone: false,
})
export class ChatComponent implements OnInit {
  socket!: Socket;
  messages: {
    username: string;
    message: string;
    attachment?: { filename: string; url: string };
  }[] = [];
  currentMessage = "";
  currentUser = ""; // Logged-in user's username
  selectedFile: File | null = null; // Holds the selected file

  constructor() {}

  ngOnInit(): void {
    // Connect to the Socket.IO server
    this.socket = io("https://asg-backend-dwi1.onrender.com");

    // Listen for incoming messages
    this.socket.on("chatMessage", (data) => {
      this.messages.push(data);
    });

    // Retrieve the logged-in username from sessionStorage
    this.currentUser = sessionStorage.getItem("username") || "Guest";
  }

  sendMessage(): void {
    if (this.currentMessage.trim() || this.selectedFile) {
      const messageData: any = {
        username: this.currentUser,
        message: this.currentMessage,
      };

      // If an attachment is selected, read and include it
      if (this.selectedFile) {
        const reader = new FileReader();
        reader.onload = () => {
          messageData.attachment = {
            filename: this.selectedFile!.name,
            content: reader.result, // Base64 encoded content
          };

          // Emit the message with attachment
          this.socket.emit("chatMessage", messageData);
          this.clearAttachment(); // Clear the selected file
        };
        reader.readAsDataURL(this.selectedFile); // Read file as Base64
      } else {
        // Emit the message without attachment
        this.socket.emit("chatMessage", messageData);
      }

      // Clear the input field
      this.currentMessage = "";
    }
  }

  onFileSelect(event: any): void {
    this.selectedFile = event.target.files[0] || null;
  }

  clearAttachment(): void {
    this.selectedFile = null;
  }

  isImage(filename: string): boolean {
    const fileExtension = filename.split(".").pop()?.toLowerCase();
    return (
      fileExtension === "png" ||
      fileExtension === "jpg" ||
      fileExtension === "jpeg"
    );
  }
}

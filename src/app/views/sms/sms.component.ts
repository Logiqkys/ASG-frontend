import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-sms",
  templateUrl: "./sms.component.html",
  styleUrls: ["./sms.component.css"],
  standalone: false,
})
export class SmsComponent {
  messages: any[] = []; // Inbox messages
  selectedMessage: any = null; // Selected message details
  newMessage = {
    to: "+639453383048", // Default recipient (Twilio Virtual Phone Number)
    body: "",
    attachment: null as File | null, // File attachment
  };

  constructor(private http: HttpClient) {}

  // Fetch sent messages from the backend
  fetchMessages(): void {
    console.log("Fetching sent messages from backend...");
    this.http
      .get<any>("https://asg-backend-dwi1.onrender.com/sms/sent")
      .subscribe(
        (response) => {
          if (response.success) {
            console.log("Sent messages fetched:", response.messages);
            this.messages = response.messages.map((msg: { body: string }) => ({
              ...msg,
              attachmentUrl: this.extractAttachmentUrl(msg.body),
            })); // Add attachment URL if present
          }
        },
        (error) => {
          console.error("Error fetching messages:", error);
          alert("Failed to load messages.");
        }
      );
  }
  extractAttachmentUrl(body: string): string | null {
    const urlRegex = /(https?:\/\/[^\s]+)/g; // Regex to match URLs
    const matches = body.match(urlRegex);
    return matches ? matches[0] : null; // Return the first URL or null if not found
  }
  // Fetch media list for a specific message SID
  async fetchMediaList(messageSid: string): Promise<any[]> {
    const url = `https://asg-backend-dwi1.onrender.com/sms/messages/${messageSid}/media`;
    try {
      const response = await this.http.get<any>(url).toPromise();
      return response.media || [];
    } catch (error) {
      console.error("Error fetching media list:", error);
      return [];
    }
  }

  getFileNameFromUrl(url: string): string {
    return url.substring(url.lastIndexOf("/") + 1);
  }
  downloadAttachment(url: string): void {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = this.getFileNameFromUrl(url); // Extract file name
    anchor.target = "_blank"; // Open in a new tab as fallback
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }

  // Check if the media URL points to an image
  isImage(url: string): boolean {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  }

  // Send a new SMS
  sendMessage(): void {
    const formData = new FormData();
    formData.append("to", this.newMessage.to); // Recipient number
    formData.append("body", this.newMessage.body); // Message content

    if (this.newMessage.attachment) {
      formData.append("mediaUrl", this.newMessage.attachment); // Add attachment
    }

    console.log("Sending SMS with data:", this.newMessage);

    this.http
      .post("https://asg-backend-dwi1.onrender.com/sms/send", formData)
      .subscribe(
        (response) => {
          console.log("Message sent successfully:", response);
          alert("Message sent successfully!");
          this.newMessage = { to: "+19016574402", body: "", attachment: null }; // Reset form
          this.fetchMessages(); // Refresh the inbox after sending
        },
        (error) => {
          console.error("Error sending message:", error);
          alert("Failed to send message.");
        }
      );
  }

  // Select a file for the message
  onFileSelect(event: any): void {
    this.newMessage.attachment = event.target.files[0];
    console.log("File selected:", this.newMessage.attachment);
  }

  // Select a message for detailed view
  selectMessage(index: number): void {
    this.selectedMessage = this.messages[index];
    console.log("Selected message:", this.selectedMessage);
  }

  // Delete a message from the inbox
  deleteMessage(index: number): void {
    console.log("Deleting message at index:", index);
    this.messages.splice(index, 1);
    this.selectedMessage = null;
  }
}

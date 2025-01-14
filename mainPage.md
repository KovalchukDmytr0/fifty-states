Task: Create Main Page with Navigation and Purchasing Feature
The main page will allow users to:
Navigate to any of the 50 states.
Purchase pixels on a specific state's page.
Submit their order, including the state, email, pixel size, and uploaded image.

1. Main Page Features
Design Goals:
Visually original and user-friendly.
Interactive navigation for 50 states.
Form for users to purchase pixels.
Components:
Interactive U.S. Map:


Highlight each state as the user hovers or clicks.
Clicking navigates to that state’s pixel page.
Searchable State List:


Dropdown or search bar for alternative navigation.
Purchase Form:


Fields:
State (dropdown or selected via map).
Pixel size (e.g., width x height in pixels).
Email address.
File upload for images.
Submit button to send the order.

2. API Endpoint for Order Submission
Endpoint Details:
HTTP Method: POST
URL: /api/order
Request Body:
 {
  "state": "california",
  "email": "user@example.com",
  "image": "<base64_encoded_image>",
  "pixelSize": {
    "width": 50,
    "height": 50
  }
}


Response:
Success: { "status": "success", "message": "Order submitted for review." }
Error: { "status": "error", "message": "Invalid input." }
Supported Features:
Image validation (file type, size limits, etc.).
State validation.
Pixel size validation.

3. Backend Implementation
Dependencies
Install necessary packages:
npm install express multer body-parser nodemailer

Code for API Endpoint
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedFormats = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/svg+xml"];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file format"), false);
    }
  },
});

const orders = []; // Simulated database

app.post("/api/order", upload.single("image"), (req, res) => {
  const { state, email, pixelSize } = req.body;

  // Validate state
  const states = ["alabama", "alaska", "arizona", "arkansas", "california"];
  if (!states.includes(state)) {
    return res.status(400).json({ status: "error", message: "Invalid state name." });
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: "error", message: "Invalid email address." });
  }

  // Validate pixel size
  if (!pixelSize || pixelSize.width <= 0 || pixelSize.height <= 0) {
    return res.status(400).json({ status: "error", message: "Invalid pixel size." });
  }

  // Save order to simulated database
  const order = {
    state,
    email,
    pixelSize,
    image: req.file.buffer, // Binary data for storage
    status: "pending",
  };

  orders.push(order);

  res.status(200).json({ status: "success", message: "Order submitted for review." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ status: "error", message: err.message });
  }
  return res.status(500).json({ status: "error", message: "Server error." });
});

app.listen(3000, () => console.log("Server running on port 3000"));


4. Frontend Implementation
Interactive Map
Use libraries like D3.js or Leaflet for the U.S. map:
Highlight states on hover.
On click, navigate to the state’s pixel page.
Purchase Form
Example form design:
<div>
  <form id="purchaseForm">
    <label for="state">Select State:</label>
    <select id="state" required>
      <option value="california">California</option>
      <option value="texas">Texas</option>
      <!-- Add all states -->
    </select>

    <label for="pixelWidth">Pixel Width:</label>
    <input type="number" id="pixelWidth" min="1" required />

    <label for="pixelHeight">Pixel Height:</label>
    <input type="number" id="pixelHeight" min="1" required />

    <label for="email">Your Email:</label>
    <input type="email" id="email" required />

    <label for="image">Upload Image:</label>
    <input type="file" id="image" accept="image/*" required />

    <button type="submit">Submit</button>
  </form>
</div>

<script>
  document.getElementById("purchaseForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const state = document.getElementById("state").value;
    const pixelWidth = document.getElementById("pixelWidth").value;
    const pixelHeight = document.getElementById("pixelHeight").value;
    const email = document.getElementById("email").value;
    const image = document.getElementById("image").files[0];

    const formData = new FormData();
    formData.append("state", state);
    formData.append("pixelSize", JSON.stringify({ width: pixelWidth, height: pixelHeight }));
    formData.append("email", email);
    formData.append("image", image);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.status === "success") {
        alert("Order submitted successfully!");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  });
</script>


5. Next Steps
Implement and test the main page design.
Develop admin panel features for reviewing and approving orders.
Add additional error handling (e.g., duplicate email, pixel overlap).


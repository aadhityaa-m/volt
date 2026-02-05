# VoltWatch India - Energy Dashboard

An interactive, "Liquid Glass" UI dashboard for monitoring household energy consumption, featuring Big Data simulation and AI forecasting.

## 🚀 How to Run

### Option 1: The Easiest Way (Double Click)
Since this is a static web application, you can simply:
1.  Navigate to the project folder: `/Users/aadhi/Documents/volt/`
2.  Double-click **`index.html`** to open it in your web browser (Chrome, Safari, Edge, etc.).

### Option 2: Using a Local Server (Recommended)
For the best experience (avoids any browser security restrictions):

**Using Python:**
Run this command in your terminal:
```bash
python3 -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

**Using VS Code:**
If you have the **Live Server** extension installed, right-click `index.html` and select "Open with Live Server".

## 📂 Project Structure

-   **`index.html`**: The main dashboard interface.
-   **`dataLogic.js`**: Handles the "Big Data" engine (generates 1M points) and analytics.
-   **`mlLogic.js`**: Contains the TensorFlow.js logic for training the AI model.
-   **`scripts/generate_dataset.py`**: A Python script to generate a physical CSV dataset (`energy_dataset.csv`) for your records.

## 🤖 Features to Try

1.  **Liquid UI**: Toggle the **Theme Switch** (🌙/☀️) in the sidebar to see the glassmorphism effects.
2.  **Big Data**: Go to the **Analytics** view to generate and visualize 2 years of data instantly.
3.  **AI Training**:
    -   Go to **Analytics View**.
    -   Scroll down to **AI Cost Predictor**.
    -   Click **Train Model** to run a neural network in your browser!

## 🌍 How to Publish (Go Live!)

Since this app operates entirely **Client-Side** (no backend server required), you can host it for **FREE** on almost any static hosting platform.

### Option 1: GitHub Pages (Best for Developers)
1.  Upload this folder to a GitHub Repository.
2.  Go to **Settings** > **Pages**.
3.  Select `main` branch and click **Save**.
4.  Your app will be live at `https://yourname.github.io/voltwatch`!

### Option 2: Vercel / Netlify (Drag & Drop)
1.  Go to [Vercel.com](https://vercel.com) or [Netlify.com](https://netlify.com).
2.  Drag and drop this entire folder onto their dashboard.
3.  It will instantly give you a live URL (e.g., `voltwatch.vercel.app`) to share with clients.

### Option 3: Simple File Sharing
Since the app is robust, you can also zip the folder and email it to a client. They just need to unzip and double-click `index.html`.

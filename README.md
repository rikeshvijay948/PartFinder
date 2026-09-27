# PartFinder — Automotive Spares Discovery Network

PartFinder is a modern, full-featured automotive spare parts discovery and reservation platform for professional mechanics, repair workshops, and spare-parts retail counters.

---

## 🌟 Google Maps Platform Places API (New) Integration

PartFinder dynamically discovers **REAL** nearby auto-parts and spare-parts businesses using the **Google Places API (New)** via Nearby Search (`/v1/places:searchNearby`).

### 🛠️ Google Cloud Setup Instructions

1. **Create / Select a Google Cloud Project**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Create a new project (e.g. `PartFinder-Spares`).

2. **Enable Google Places API (New)**:
   - Navigate to **APIs & Services** > **Library**.
   - Search for **Places API (New)** (Make sure to select the New Places API).
   - Click **Enable**.

3. **Create and Restrict API Key**:
   - Go to **APIs & Services** > **Credentials**.
   - Click **Create Credentials** > **API Key**.
   - Click **Edit API Key** and set:
     - **API Restrictions**: Restrict key to *Places API (New)*.
     - **Application Restrictions**: Set HTTP Referrers (e.g. `http://localhost:3000/*` in development).

4. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Paste your API key into `.env`:
     ```env
     VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
     ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

> [!NOTE]
> If `VITE_GOOGLE_MAPS_API_KEY` is not provided, PartFinder automatically operates in **Demo Mode (Offline Preview)** so features and user flows can be demonstrated without interruptions.

---

## 🚀 Key Modules & Roles

1. **Mechanic Part Search & Real Shop Discovery**:
   - Browser Geolocation (`GPS Active`) or Manual City selection (Salem, Coimbatore, Chennai, Bangalore, etc.).
   - Nearby Search via Places API (New) with field masks for address, phone, business status, hours, and direct Google Maps URI.
   - Haversine geographic distance calculation.
   - Clear distinction: *Google Places = Real Shop Discovery*, *PartFinder Inventory = Confirmed Shelf Stock*.

2. **Reservation & Order Tracking Flow**:
   - Direct Counter Hold or Express Bay Delivery.
   - 5-stage live dispatch tracker with simulated GPS courier map.

3. **Multi-Role Portals**:
   - 🛠️ **Mechanic Portal**: `/mechanic/dashboard`, `/mechanic/orders`, `/mechanic/reservations`
   - 🏬 **Shop Portal**: `/shop/dashboard` (Live shelf stock updates and sync)
   - 🛡️ **Super Admin Console**: `/admin/dashboard` (Platform KPI analytics and audit logs)

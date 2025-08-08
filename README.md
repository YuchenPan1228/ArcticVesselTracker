# Arctic Marine Vessel Tracker

A web application for tracking and visualizing vessel movements in Arctic waters using AIS data.

## Features

- Interactive map visualization of vessel movements
- Filtering by vessel type and country
- Detailed vessel statistics
- Vessel trajectory visualization
- Date range selection for historical data

## Tech Stack

### Frontend
- React 18
- TypeScript
- Mapbox GL JS for map visualization
- Chart.js for data visualization
- Vite for build tooling

### Backend
- Flask (Python)
- GeoJSON for spatial data

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker

1. Clone the repository:
```bash
git clone https://github.com/YuchenPan1228/ArcticVesselTracker.git
cd ArcticVesselTracker
```

2. Start the application using Docker Compose:
```bash
docker-compose up
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Local Development

#### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Access the frontend at http://localhost:3000

#### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask application:
```bash
flask run
```

5. Access the API at http://localhost:5000

## API Endpoints

- `GET /api/vessels?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`: Get vessel data for the specified date range
- `GET /api/health`: Health check endpoint

## License

This project is licensed under the MIT License - see the LICENSE file for details.
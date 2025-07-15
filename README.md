# Weather App

## Project Documentation

### 1. Technologies Used

This project is built using the following technologies:

- **Angular**
- **PrimeNG V17** for UI components
- **primeflex** for CSS
- **RxJS** for handling asynchronous data streams
- **Open-Meteo API** for fetching weather data
- **Material Icons**
- **Firebase** for user authentication

---

### 2. Key Features

#### 2.1 Current Weather

- Fetches weather data from the Open Meteo API via a dedicated service.
- Displays weather details in a separate component, utilizing PrimeNG components (e.g., `p-card`).

#### 2.2 City Management (CRUD)

- A component for listing multiple cities is available.
- Implements CRUD operations (Add, Edit, Delete) for cities.
- Manages the list of cities using `RxJS BehaviorSubject`.

#### 2.3 Historical Weather Data

- Extends the service to fetch historical weather data.
- Uses `RxJS switchMap` to manage API calls based on city selection.
- A dedicated component displays historical weather data.

#### 2.4 Additional Features

- **User Authentication**: Integrates a user authentication service with Firebase.
- **Settings and Customization**:
  - Allows users to customize units (Celsius/Fahrenheit).
  - Allows users to customize themes.

---

### 3. Installation and Setup

To get a local copy up and running, follow these simple steps.

#### Prerequisites

Make sure you have [Node.js](https://nodejs.org/en/) and [Angular CLI](https://angular.io/cli) installed:

```bash
npm install -g @angular/cli
```

#### Installation

1. Clone the repository:

```bash
git clone [repository-url] # Replace with your actual repository URL
```

2. Navigate to the project directory:

```bash
cd weather-app
```

3. Install NPM dependencies:

```bash
npm install
```

---

### 4. Running the Application

1. Start the development server:

```bash
ng serve
```

2. Open your browser and navigate to:

```
http://localhost:4200/
```

# Budget App
A personal finance management application built with React, Vite, and Firestore. This app allows users to plan and track their finances efficiently.

## Features
- Real-Time Data Sync: Utilizes Firestore for real-time data synchronization across devices.
- Responsive Design: Built with Vite and Tailwind CSS for a fast and responsive user interface.
- User Authentication: Secure sign-up and login functionality to protect user data.
- Expense Tracking: Add, edit, and delete expenses with categories and amounts.
- Budget Planning: Set monthly budgets and track spending against them.
- Data Visualization: View spending trends and budget adherence through charts.

## Technologies Used
- Frontend: React, Vite, Tailwind CSS
- Backend: Firebase (Firestore, Authentication)
- Deployment: Firebase Hosting

## Getting Started
### Prerequisites
Ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Installation
1. Clone the repository:
```
git clone https://github.com/mginham/budget-app.git
cd budget-app
```
2. Install dependencies:
```
npm install
```
3. Set up Firebase:
   - Create a Firebase project at Firebase Console.
   - Enable Firestore and Firebase Authentication.
   - Obtain your Firebase configuration object and replace the placeholder in your project.
4. Run the development server:
```
npm run dev
```
The app will be available at http://localhost:3000.

## Deployment
To deploy the app to Firebase Hosting:
1. Build the project:
```
npm run build
```
2. Deploy to Firebase:
```
firebase deploy
```
Follow the prompts to complete the deployment process.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

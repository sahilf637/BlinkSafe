# Blink Safe

![Blink Safe Logo][logo]

![1][a1]
![2][a2]
![3][a3]
![4][a4]

## Protecting Your Eyes, One Blink at a Time

Blink Safe is a mobile application that monitors eye health in real-time, providing personalized recommendations and alerts to prevent eye strain and damage. Built with Expo, it offers a seamless experience for all users, with special features for parents to protect their children's vision.

## Features

### 🔍 Real-time Eye Monitoring
- Tracks blink rate, eye strain indicators, and screen time
- Uses device camera with privacy-focused processing
- Low battery consumption for all-day monitoring

### 📊 Personalized Analytics
- Daily, weekly, and monthly eye health reports
- Customized recommendations based on usage patterns
- Progress tracking for improving eye health habits

### 👨‍👩‍👧‍👦 Parental Controls
- Monitor children's eye health remotely
- Set healthy screen time limits
- Receive alerts when concerning patterns are detected

### ⏰ Smart Notifications
- Timely reminders to take screen breaks
- Alerts for prolonged eye strain
- Emergency notifications for potentially harmful conditions

### 🔒 Privacy First
- All sensitive data is processed locally
- Optional secure cloud backup for analytics
- Complete control over data sharing preferences

## Screenshots

![Dashboard View][dashboard]

*The main dashboard showing eye health metrics*

![Analytics Screen][analytics]

*Detailed analytics and recommendations*

![Recommendation][parental]

*Recommendations interface*

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI

### Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blink-safe.git
cd blink-safe
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
expo start
```

4. Run on your device:
   - Scan the QR code with the Expo Go app
   - Or run on simulators/emulators:
     ```bash
     expo start --ios
     expo start --android
     ```

## Usage Guide

### Basic Usage
1. Grant camera permissions when prompted
2. Position your device at a comfortable viewing distance
3. The app will begin monitoring automatically
4. Check the dashboard for real-time insights

### Parental Setup
1. Create a parent account
2. Add child profiles
3. Link your child's device using the provided code
4. Set monitoring preferences and alerts
5. Access reports from the family dashboard

## Technology Stack

- **Frontend:** React Native with Expo
- **Backend:** Flask
- **Computer Vision:** TensorFlow.js for eye tracking
- **Authentication:** Firebase Auth

## Contributing

We welcome contributions to Blink Safe! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) guide for more information.

---

[logo]: /Static/logo.jpeg
[dashboard]: /Static/dashboard.jpeg
[analytics]: /Static/ana2.jpeg
[parental]: /Static/ana.jpeg
[a1]: /Static/play/1.jpeg
[a2]: /Static/play/2.jpeg
[a3]: /Static/play/3.jpeg
[a4]: /Static/play/4.jpeg

*Note: Replace the image paths with your actual image locations once they're added to the project.*

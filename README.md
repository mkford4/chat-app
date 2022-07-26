# chat-app
Native React mobile application

Description:
This chat app was developed using React Native for use on mobile devices, both Android & iOS.
The app includes a home screen to enter the chat and a chat interface via Gifted Chat to send messages, images and the user's location.

User Stories:
● As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my
friends and family.
● As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.
● As a user, I want to send images to my friends to show them what I’m currently doing.
● As a user, I want to share my location with my friends to show them where I am.
● As a user, I want to be able to read my messages offline so I can reread conversations at any
time.
● As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface.

Key Features:
● A page where users can enter their name and choose a background color for the chat screen
before joining the chat.
● A page displaying the conversation, as well as an input field and submit button.
● The chat must provide users with two additional communication features: sending images
and location data.
● Data gets stored online and offline.

How to run & use this project:
Expo
- Install Expo via terminal and the Expo app on your mobile device:
npm install expo-cli -g
- Install all dependencies (see package.json) and start the app: expo start
- Launch Expo app on smartphone and scan the QR code in terminal or Expo window pop-up to open project app
- Also: can launch app to test with Android emulator or web browser within Metro Bundler
Firebase
This app uses Google Firebase (version 7) for data storage to store messages and images.
- Sign in to firebase.google.com to start & "create a project" - start in 'test mode'
- Create a collection, named "messages", and generate random Document IDs
- Install Firestore via Firebase in project: npm install firebase 7.9.0 (contingent on node version 14 or less)
- Link Firebase storage to your project app via GitHub in Project Settings
- Import Firebase into Chat.js file and initialize app with config:
![firebase1](https://user-images.githubusercontent.com/91907563/180576193-062592bd-584e-4dc4-b8cd-5871ac2f5168.png)

- Reference your 'messages' collection in Chat.js
![firebase2](https://user-images.githubusercontent.com/91907563/180576257-b0a97979-b47f-42a2-b47a-11a2f5166780.png)

Gifted Chat
![IMG-5565](https://user-images.githubusercontent.com/91907563/181059038-cb9a47e9-6add-4e0a-8e3c-bcff9313bd88.PNG) ![IMG-5566](https://user-images.githubusercontent.com/91907563/181059053-03f7063f-5c35-493a-88fb-8c4ecb54826d.PNG)

Custom Actions


# J.A.R.V.I.S - Your AI assistant , Reimagined

## INTRODUCTION
J.A.R.V.I.S is an AI-powered assistant that unifies all your productivity, creativity, and smart home tools into one intelligent voice interface. Our mission is to simplify the future by bringing powerful AI and IoT technology together — private, personalized, and always within reach.You can chat with it, talk to it, and use it to control tasks or even smart devices.

<<<<<<< HEAD
### Landing Page
![Landing Page](./screenshorts/landingpage.png)

## FEATURE

1. Conversational AI powered by OpenAI and Google Gemini APIs.
2. Voice Assistant Mode – speak to JARVIS and hear it reply.
3. User Authentication
4. Login with Google, Microsoft, or Phone number.
5. Chat History – conversations are stored so you can pick up where you left off.
6. Task Scheduler – create and manage tasks via chat.
7. IoT Integration (planned) – detect and connect with smart home devices.
8. Modern UI with holographic orb animations and dark theme.

### Login Options
![Login](./screenshorts/login.png)

### JARVIS Orb UI
![JARVIS UI](./screenshorts/jarvisui.png)

### Chat in Action
![Chatbot](./screenshorts/chatbot.png)

### Task Scheduler
![Task Scheduler](./screenshorts/taskscheduler.png)


## TECH STAKE

### FRONTEND
React + TailwindCSS
Framer Motion (animations)
Shadcn UI Components

### BACKEND 
Node.js + Express
Passport.js for authentication
MySQL / Neo4j for data storage
OpenAI + Google Generative AI SDKs

## PROJECT STRUCTURE

jarvis-main/
│── README.md           # Documentation
│── package.json        # Frontend dependencies
│── jarvis-server/      # Backend (Express + DB + APIs)
│   ├── index.js        # Server entry
│   ├── db.js           # Database connection
│   ├── config/         # Auth configs
│   ├── controllers/    # API controllers
│   ├── models/         # Database models

## INSTALLATION

### CLONE THE REPO
git clone https://github.com/your-username/jarvis-main.git
cd jarvis-main

### INSTALL THE DEPENDICIES

Frontend
npm install

Backend
cd jarvis-server
npm install

### SETTING UP THE ENVIRONMENT

Create a .env file in jarvis-server/ with:
PORT=5000
DB_URI=your_mysql_or_neo4j_connection_string
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_google_gemini_key
SESSION_SECRET=your_secret

### RUN THE PROJECT

Backend
cd jarvis-server
npm start

Frontend
cd jarvis-ui
npm start
Frontend runs at http://localhost:3000
Backend runs at http://localhost:5000

## USAGE GUDE

Open http://localhost:3000
Sign up or login (Google/Microsoft/Phone).
Click Launch Assistant to start the hologram orb.
Use voice or text chat to talk to JARVIS.
Create tasks, ask questions, or control devices.

## FUTURE ROADMAP

=======
## FEATURE

1. Conversational AI powered by OpenAI and Google Gemini APIs.
2. Voice Assistant Mode – speak to JARVIS and hear it reply.
3. User Authentication
4. Login with Google, Microsoft, or Phone number.
5. Chat History – conversations are stored so you can pick up where you left off.
6. Task Scheduler – create and manage tasks via chat.
7. IoT Integration (planned) – detect and connect with smart home devices.
8. Modern UI with holographic orb animations and dark theme.

## TECH STAKE

### FRONTEND
React + TailwindCSS
Framer Motion (animations)
Shadcn UI Components

### BACKEND 
Node.js + Express
Passport.js for authentication
MySQL / Neo4j for data storage
OpenAI + Google Generative AI SDKs

## PROJECT STRUCTURE

jarvis-main/
│── README.md           # Documentation
│── package.json        # Frontend dependencies
│── jarvis-server/      # Backend (Express + DB + APIs)
│   ├── index.js        # Server entry
│   ├── db.js           # Database connection
│   ├── config/         # Auth configs
│   ├── controllers/    # API controllers
│   ├── models/         # Database models

## INSTALLATION

### CLONE THE REPO
git clone https://github.com/your-username/jarvis-main.git
cd jarvis-main

### INSTALL THE DEPENDICIES

Frontend
npm install

Backend
cd jarvis-server
npm install

### SETTING UP THE ENVIRONMENT

Create a .env file in jarvis-server/ with:
PORT=5000
DB_URI=your_mysql_or_neo4j_connection_string
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_google_gemini_key
SESSION_SECRET=your_secret

### RUN THE PROJECT

Backend
cd jarvis-server
npm start

Frontend
cd jarvis-ui
npm start
Frontend runs at http://localhost:3000
Backend runs at http://localhost:5000

## USAGE GUDE

Open http://localhost:3000
Sign up or login (Google/Microsoft/Phone).
Click Launch Assistant to start the hologram orb.
Use voice or text chat to talk to JARVIS.
Create tasks, ask questions, or control devices.

## FUTURE ROADMAP

>>>>>>> 9fdaf2a58746fe17a98b47b0c4440097966f715e
1. IoT-Intergration and Detection.
2. More AI models support.
3. Mobile app version.
4. Multi-language voice support
5. Smart calendar integration (Google/Outlook)
6. Personalization (custom wake word, theme, voice)
7. Plugin system for third-party integrations (Spotify, Weather, News)


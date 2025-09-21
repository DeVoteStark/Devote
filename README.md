# DeVote: A Decentralized Voting Platform

## Vision

🌍 To empower communities worldwide by providing a secure, transparent, and decentralized voting platform that fosters trust and inclusivity in decision-making processes.

## Mission

🎯 To leverage cutting-edge blockchain technology to create a user-friendly and accessible voting system that eliminates barriers, enhances participation, and ensures the integrity of community-driven decisions.

## Problem

Traditional voting systems face numerous challenges, including:

- _Lack of Trust:_ Concerns about election fraud, tampering, and lack of transparency undermine confidence in results.
- _High Costs:_ Organizing and securing traditional voting processes is often expensive and resource-intensive.
- _Accessibility Barriers:_ Physical voting locations and paper-based systems exclude many participants due to geographical or mobility constraints.
- _Privacy Issues:_ Ensuring voter anonymity while maintaining security is a persistent challenge.
- _Low Engagement:_ Without incentives or modernized systems, many people are disengaged from the voting process.

## Solution

DeVote addresses these challenges with an innovative, blockchain-powered platform built on _Starknet_, a Layer 2 Ethereum solution. Our platform ensures:

- _Transparency:_ All voting records are publicly verifiable on the blockchain, eliminating doubts about integrity. 🔍
- _Cost-Effectiveness:_ Leveraging Starknet reduces transaction costs significantly, making decentralized voting feasible for communities of all sizes. 💰
- _Accessibility:_ Users can vote from anywhere with internet access, removing geographical and mobility barriers. 🌐
- _Privacy and Security:_ The project uses hashed IDs to protect voters' identities. This interim measure ensures a secure voting process, with plans to incorporate ZK technology to elevate privacy standards further. 🔒
- _Community Engagement:_ We plan to implement an NFT incentive program in the future to reward participants after voting a certain number of times. This feature aims to foster ongoing participation and engagement, contingent on the growth of the project through grants or rewards. 🏆 🏆
- _Guidance:_ Our goal is to ensure users have the best possible voting experience. That’s why we developed an AI Agent to assist voters, guiding them through the process and addressing any questions they may have along the way. 🤖

## Ways to Implement the Project (Use Cases)

### 1. _Local Governance and Community Projects_

- _Example:_ The community of Tamarindo is set to be the first testers of DeVote, using the platform to decide on local matters such as event hosting, renovations, or budget allocations.
- _Impact:_ Increased community involvement, better planning, reduced administrative costs, and enhanced transparency in decision-making.

### 2. _Non-Profit Organizations and NGOs_

- Enable members to vote on key issues such as project funding, leadership elections, or policy changes.
- _Impact:_ Empowering diverse members across geographical locations to have an equal say in decision-making.

### 3. _Corporate Decision-Making_

- Use DeVote to gather employee feedback, conduct shareholder meetings, or decide on company policies.
- _Impact:_ Streamlined processes and increased trust in corporate governance.

### 4. _Educational Institutions_

- Allow students, faculty, and stakeholders to vote on matters such as curriculum changes, event planning, or administrative policies.
- _Impact:_ Democratized decision-making and better representation of all voices.

### 5. _Grassroots Movements and Activism_

- Provide a secure and anonymous way for activists to vote on initiatives, priorities, or strategies without fear of retaliation.
- _Impact:_ Enhanced coordination and collective action.

### 6. _Collaborative NFT Projects_

- Enable decentralized governance for NFT projects, where holders can vote on roadmap decisions or allocation of funds.
- _Impact:_ Building stronger communities around NFT ecosystems while ensuring democratic decision-making.

---

# Technical Setup For Developers

Ensure that the following tools are installed:

- **Node.js** (v18.x or later)  
  Download: [https://nodejs.org/](https://nodejs.org/)

- **Yarn** (v1.22.x or later)  
  Install via npm:

  ```bash
  npm install -g yarn
  ```

- **PostgreSQL** (if the backend requires a database)
- **Cairo** (for smart contract development)  
  Install: [https://www.cairo-lang.org/](https://www.cairo-lang.org/)

- ⚡ **Starknet CLI** (for blockchain interactions)  
  Install:
  ```bash
  pip install starknet-devnet
  ```

---

## 🛠️ Project Structure Overview

This monorepo is organized as follows:

```
/DevoteApp         → Next.js frontend application with API routes
├── app/           → Next.js 13+ app router pages and API routes
├── components/    → React components and UI elements
├── hooks/         → Custom React hooks
├── lib/           → Utility functions and services
├── models/        → MongoDB/Mongoose schemas
├── interfaces/    → TypeScript interfaces
└── public/        → Static assets

/CairoContracts    → Starknet smart contracts (Cairo)
├── src/           → Cairo contract source files
└── Scarb.toml     → Scarb configuration
```

---

## 🔧 Installation Instructions

Follow the steps below to set up and run the project locally:

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd <project-folder>
```

### 2️⃣ Install Dependencies

Navigate to the DevoteApp directory and install dependencies:

```bash
cd DevoteApp
yarn install
```

> This installs all required packages for the Next.js application.

### 3️⃣ Configuration Instructions

Create a `.env.local` file in the `DevoteApp/` directory with the following variables:

```env
# Database Configuration
MONGO_URI=mongodb://localhost:27017/devote

# Email Configuration (for user notifications)
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# OpenAI Configuration (for AI Agent)
OPENAI_API_KEY=your-openai-api-key

# KYC/SumSub Configuration (for identity verification)
SUMSUB_TOKEN=your-sumsub-app-token
SUMSUB_API_KEY=your-sumsub-secret-key
NEXT_PUBLIC_SUMSUB_ACCESS_TOKEN=your-sumsub-access-token

# Starknet Wallet Configuration (for admin operations)
NEXT_PUBLIC_DEVOTE_PUBLIC_WALLET=your-devote-wallet-address
NEXT_PUBLIC_DEVOTE_SECRET_KEY_ENCRYPTED=your-encrypted-private-key

# Secret Token (for admin access)
NEXT_PUBLIC_SECRET_TOKEN=your-secret-admin-token
```

> **Note:** Replace all placeholder values with your actual credentials. Some services like SumSub and OpenAI require account setup.

### 4️⃣ Database Setup

The project uses MongoDB. Ensure MongoDB is running locally or use MongoDB Atlas:

**Local MongoDB:**

- Install and start MongoDB locally
- The connection string should be: `mongodb://localhost:27017/devote`

**MongoDB Atlas (Cloud):**

- Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a new cluster and get your connection string
- Update `MONGO_URI` in your `.env.local` file

### 5️⃣ Smart Contract Setup

To work with the Cairo contracts:

```bash
cd CairoContracts
scarb build  # Compile contracts
scarb test   # Run tests
```

---

## ▶️ Running the Application

### Run the **Next.js Application**

```bash
cd DevoteApp
yarn dev
```

📍 Visit: `http://localhost:3000`

> The application includes both frontend and API routes in a single Next.js app.

### Run the **Starknet Devnet** (for smart contracts testing)

```bash
starknet-devnet --host 127.0.0.1 --port 5050
```

---

## 👤 Demo User Setup

### Creating a Demo User

To test the application, you can create a demo user through the admin interface:

1. **Access Admin Panel:**

   ```
   http://localhost:3000/secret?token=YOUR_SECRET_TOKEN
   ```

   Replace `YOUR_SECRET_TOKEN` with the value you set in `NEXT_PUBLIC_SECRET_TOKEN`

2. **Create Super User:**

   - Fill out the form with:
     - Email: `demo@example.com`
     - Full Name: `Demo User`
     - INE: `123456789` (demo ID)
     - Password: `demo123`
   - Click "Create Superuser"
   - Fund the generated wallet with Sepolia ETH using the [Starknet Faucet](https://starknet-faucet.vercel.app/)

3. **Alternative: Test Login Page:**
   ```
   http://localhost:3000/test-login
   ```
   This page allows you to generate test wallets and deploy them for testing purposes.

### Demo User Credentials

- **Email:** `demo@example.com`
- **Password:** `demo123`
- **Wallet:** Auto-generated and deployed during creation
- **Status:** Admin user with full permissions

> **Note:** The demo user will have admin privileges and can create proposals, manage users, and oversee voting processes.

---

## 🧪 Running Tests

To run tests for different components:

- Next.js Application:
  ```bash
  cd DevoteApp
  yarn test
  ```
- Cairo Smart Contracts:
  ```bash
  cd CairoContracts
  scarb test
  ```

---

## 💅 Code Formatting & Linting

Ensure code consistency:

```bash
cd DevoteApp
yarn lint
```

---

## 🛑 Troubleshooting

### Common Issues:

- **Port conflicts** → Ensure no other services are running on port 3000.
- **Database errors** → Verify MongoDB is running and connection string is correct.
- **Environment variables** → Check that all required variables are set in `.env.local`.
- **Email issues** → Verify SMTP credentials and ensure 2FA is disabled or using app passwords.
- **KYC/SumSub errors** → Ensure SumSub credentials are valid and account is active.
- **Smart contract issues** → Restart Starknet Devnet and redeploy contracts.

---

## 🧭 You're all set!

You’re now ready to explore and contribute to the DEVOTE project. Happy coding! 💻✨

🌟 DeVote is not just a dApp but a movement towards creating a world where every voice matters and decisions are made collectively, transparently, and securely.

**Trust. Vote. Transform.**

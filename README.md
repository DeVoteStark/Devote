# DeVote: A Decentralized Voting Platform

## Vision

🌍 To empower communities worldwide by providing a secure, transparent, and decentralized voting platform that fosters trust and inclusivity in decision-making processes.

## Mission

🎯 To leverage cutting-edge blockchain technology to create a user-friendly and accessible voting system that eliminates barriers, enhances participation, and ensures the integrity of community-driven decisions.

## Problem

Traditional voting systems face numerous challenges, including:

- *Lack of Trust:* Concerns about election fraud, tampering, and lack of transparency undermine confidence in results.
- *High Costs:* Organizing and securing traditional voting processes is often expensive and resource-intensive.
- *Accessibility Barriers:* Physical voting locations and paper-based systems exclude many participants due to geographical or mobility constraints.
- *Privacy Issues:* Ensuring voter anonymity while maintaining security is a persistent challenge.
- *Low Engagement:* Without incentives or modernized systems, many people are disengaged from the voting process.

## Solution

DeVote addresses these challenges with an innovative, blockchain-powered platform built on *Starknet*, a Layer 2 Ethereum solution. Our platform ensures:

- *Transparency:* All voting records are publicly verifiable on the blockchain, eliminating doubts about integrity. 🔍
- *Cost-Effectiveness:* Leveraging Starknet reduces transaction costs significantly, making decentralized voting feasible for communities of all sizes. 💰
- *Accessibility:* Users can vote from anywhere with internet access, removing geographical and mobility barriers. 🌐
- *Privacy and Security:* The project uses hashed IDs to protect voters' identities. This interim measure ensures a secure voting process, with plans to incorporate ZK technology to elevate privacy standards further. 🔒
- *Community Engagement:* We plan to implement an NFT incentive program in the future to reward participants after voting a certain number of times. This feature aims to foster ongoing participation and engagement, contingent on the growth of the project through grants or rewards. 🏆 🏆
- *Guidance:* Our goal is to ensure users have the best possible voting experience. That’s why we developed an AI Agent to assist voters, guiding them through the process and addressing any questions they may have along the way. 🤖

## Ways to Implement the Project (Use Cases)

### 1. *Local Governance and Community Projects*

- *Example:* The community of Tamarindo is set to be the first testers of DeVote, using the platform to decide on local matters such as  event hosting, renovations, or budget allocations.
- *Impact:* Increased community involvement, better planning, reduced administrative costs, and enhanced transparency in decision-making.

### 2. *Non-Profit Organizations and NGOs*

- Enable members to vote on key issues such as project funding, leadership elections, or policy changes.
- *Impact:* Empowering diverse members across geographical locations to have an equal say in decision-making. 

### 3. *Corporate Decision-Making*

- Use DeVote to gather employee feedback, conduct shareholder meetings, or decide on company policies.
- *Impact:* Streamlined processes and increased trust in corporate governance. 

### 4. *Educational Institutions*

- Allow students, faculty, and stakeholders to vote on matters such as curriculum changes, event planning, or administrative policies.
- *Impact:* Democratized decision-making and better representation of all voices. 

### 5. *Grassroots Movements and Activism*

- Provide a secure and anonymous way for activists to vote on initiatives, priorities, or strategies without fear of retaliation.
- *Impact:* Enhanced coordination and collective action. 

### 6. *Collaborative NFT Projects*

- Enable decentralized governance for NFT projects, where holders can vote on roadmap decisions or allocation of funds.
- *Impact:* Building stronger communities around NFT ecosystems while ensuring democratic decision-making. 

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
/ai-agent          → AI-specific logic or services  
/Backend           → Backend services and APIs  
/Frontend          → Next.js frontend application  
/contracts         → Starknet smart contracts  
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

Using Yarn, install all required packages:

```bash
yarn install
```

> This command installs all dependencies defined in the root and nested `package.json` files.

### 3️⃣ Configuration Instructions

Create a `.env.local` file in the root or inside the `Frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://user:password@localhost:5432/devotedb
STARKNET_RPC_URL=http://localhost:5050
# Add other required variables
```

### 4️⃣ Database Setup (if applicable)

If the project uses PostgreSQL:

- Ensure PostgreSQL is running.
- Apply migrations:
  ```bash
  yarn db:migrate
  ```

### 5️⃣ Smart Contract Setup

To deploy and interact with Starknet smart contracts:

```bash
cd contracts
starknet-compile contract.cairo --output contract.json
starknet deploy --contract contract.json
```

---

## ▶️ Running the Application

### Run the **Frontend**

```bash
cd Frontend
yarn dev
```

📍 Visit: `http://localhost:3000`

### Run the **Backend**

```bash
cd Backend
yarn start
```

### Run the **Starknet Devnet** (for smart contracts testing)

```bash
starknet-devnet --host 127.0.0.1 --port 5050
```

---

## 🧪 Running Tests

To run tests for different components:

- Frontend:
  ```bash
  yarn test
  ```
- Smart Contracts:
  ```bash
  starknet test
  ```

---

## 💅 Code Formatting & Linting

Ensure code consistency:

```bash
yarn format
yarn lint
```

---

## 🛑 Troubleshooting

### Common Issues:
- **Port conflicts** → Ensure no other services are running on required ports.
- **Database errors** → Verify PostgreSQL is running and credentials are correct.
- **Smart contract issues** → Restart Starknet Devnet and redeploy contracts.

---
## 🧭 You're all set!

You’re now ready to explore and contribute to the DEVOTE project. Happy coding! 💻✨

🌟 DeVote is not just a dApp but a movement towards creating a world where every voice matters and decisions are made collectively, transparently, and securely.

**Trust. Vote. Transform.** 
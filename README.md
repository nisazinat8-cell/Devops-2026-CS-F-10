# 💼 CareerConnect — Full Stack Job & Internship Portal

[![CI Pipeline](https://github.com/nisazinat8-cell/Devops-2026-CS-F-10/actions/workflows/ci.yml/badge.svg)](https://github.com/nisazinat8-cell/Devops-2026-CS-F-10/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5.svg)](https://kubernetes.io/)

**CareerConnect** is a full-stack job and internship discovery portal that helps users explore opportunities through a modern React interface backed by a secure Node.js and Express API.

The project includes authentication, job and internship listings, database integration, automated testing, containerized deployment, Kubernetes manifests, and application observability.

---

## ✨ Features

- Browse job and internship opportunities.
- User authentication with JWT and encrypted passwords.
- RESTful backend API built with Node.js and Express.
- MongoDB persistence through Mongoose.
- Responsive React 19 single-page application.
- Prometheus-compatible application metrics.
- Automated API tests and frontend production builds.
- Docker Compose support for local multi-container development.
- Kubernetes manifests with deployments, services, and health probes.
- CI/CD automation through GitHub Actions and Jenkins.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, JavaScript, CSS |
| **Backend** | Node.js 20, Express.js, REST APIs |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **Testing** | Node test suite and API integration tests |
| **Containers** | Docker, Docker Compose, Nginx |
| **Deployment** | Kubernetes |
| **CI/CD** | GitHub Actions, Jenkins |
| **Observability** | Prometheus metrics exporter |

---

## 🏗️ System Architecture

```text
               +----------------------------------------+
               |        Browser / Client Device         |
               +----------------------------------------+
                                   |
                                   v
             [ Port 3000 / 80: React 19 SPA (Nginx / Vite) ]
                                   |
                 HTTP REST Calls   |   /api/auth & /api/jobs
                                   v
             [ Port 5000: Node.js + Express REST API Server ]
                                   |
              +--------------------+--------------------+
              |                                         |
              v                                         v
   [ MongoDB Database (Port 27017) ]       [ Prometheus Exporter ]
      (Mongoose ODM + bcrypt)                 (GET /api/metrics)
```

---

## 🚀 Running the Project

### Option A: Local Development

#### 1. Start the Backend API Server

```bash
cd server
cp .env.example .env
npm install
npm run dev
# Server will run at http://localhost:5000
```

#### 2. Start the Frontend React Application

```bash
# In the project root
npm install
npm run dev
# Vite dev server will run at http://localhost:5173
```

---

### Option B: Docker Compose

Docker Compose runs MongoDB, the Express API, and the Nginx-powered React frontend together:

```bash
docker compose up --build
```

Available services:

- **Frontend UI:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Prometheus Metrics:** [http://localhost:5000/api/metrics](http://localhost:5000/api/metrics)
- **MongoDB Database:** `localhost:27017`

To stop the containers:

```bash
docker compose down
```

---

### Option C: Kubernetes Deployment

Kubernetes manifests for the application are available in [`k8s/`](./k8s):

```bash
# Create the namespace
kubectl apply -f k8s/namespace.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Deploy the backend API and frontend SPA
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check pod status
kubectl get pods -n careerconnect
```

---

## 🧪 Testing and Builds

Run the automated backend test suite:

```bash
# Run tests from the project root
npm test

# Or run tests directly in the server directory
cd server && npm test
```

Create a production frontend build:

```bash
npm run build
```

The test suite covers core API behavior, including health checks, job queries, authentication validation, and metrics output.

---

## 🔄 CI/CD Automation

### GitHub Actions

The workflow in [`.github/workflows/ci.yml`](./.github/workflows/ci.yml):

- Runs on pushes and pull requests.
- Executes the automated API test suite.
- Builds the frontend production distribution.
- Verifies Docker multi-stage container builds.

### Jenkins

The [`Jenkinsfile`](./Jenkinsfile) defines a declarative pipeline covering:

- Source checkout.
- Dependency installation.
- Unit and integration testing.
- Frontend production builds.
- Docker image creation.

---

## 📁 Repository Structure

```text
.
├── .github/workflows/   # GitHub Actions workflows
├── client components     # React application components and pages
├── k8s/                  # Kubernetes manifests
├── server/               # Express API, models, routes, and tests
├── Dockerfile.client     # Frontend container definition
├── Dockerfile.server     # Backend container definition
├── Jenkinsfile           # Jenkins pipeline
└── docker-compose.yml    # Local multi-container setup
```

---

## 👥 Project Team

- **Yuvraaj Sengar**
- **Kashish Bhati**
- **Zinat Nisa**

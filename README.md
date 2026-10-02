# 💼 CareerConnect — Full Stack Job & Internship Portal

[![CI Pipeline](https://github.com/nisazinat8-cell/Devops-2026-CS-F-10/actions/workflows/ci.yml/badge.svg)](https://github.com/nisazinat8-cell/Devops-2026-CS-F-10/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.x-blue.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-326CE5.svg)](https://kubernetes.io/)

**CareerConnect** is an enterprise-grade full-stack job and internship discovery portal. Built as a comprehensive academic and laboratory demonstration for **Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur — Department of Computer Science & Engineering**.

This repository is aligned directly with both:
1. **Full Stack Development (CSUL504)**
2. **DevOps Practices & Principles (CSUL511)**

---

## 📑 Syllabus & Course Alignment

### 1. Full Stack Development (CSUL504)
| Module | Curriculum Topics | Project Implementation |
| :--- | :--- | :--- |
| **Module 2 & 3** | HTML5, CSS3, DOM manipulation, ES6, Fetch API | Clean semantic layout, responsive styling, asynchronous API integration, and historical DOM baseline in [`legacy_vanilla/`](./legacy_vanilla). |
| **Module 4** | ReactJS, Functional Components, React Router, Forms, Client-Server Communication | Modern React 19 SPA (`App.jsx`, `Navbar.jsx`, `LoginModal.jsx`, `JobListings.jsx`, `Internships.jsx`, `About.jsx`) using React Router v7. |
| **Module 5** | Node.js, Express.js, RESTful APIs, Middleware, Security | Modular Express backend in [`server/`](./server) with CORS, JSON body parser, request metrics counter, and JWT authentication middleware. |
| **Module 6** | MongoDB & Mongoose Integration, CRUD, Password Hashing | `Job` and `User` Mongoose models, bcrypt password encryption, database connection with graceful offline fallback, and database seeding script. |

### 2. DevOps Practices & Principles (CSUL511)
| Module | Curriculum Topics | Project Implementation |
| :--- | :--- | :--- |
| **Module 3** | Version Control Systems (Git) | Branching strategy on `master`, structured commit history, and comprehensive `.gitignore`. |
| **Module 4** | Continuous Integration & Jenkins Build Automation | Automated Node test suite (`server/test/api.test.js`), GitHub Actions workflow ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)), and production Declarative Pipeline ([`Jenkinsfile`](./Jenkinsfile)). |
| **Module 5** | Containerization & Continuous Deployment (Docker) | Multi-stage [`Dockerfile.client`](./Dockerfile.client) (Nginx + Vite React), [`Dockerfile.server`](./Dockerfile.server) (Node 20 Alpine), and multi-container orchestration in [`docker-compose.yml`](./docker-compose.yml). |
| **Module 6** | Kubernetes Fundamentals & Observability (Prometheus) | Production Kubernetes manifests in [`k8s/`](./k8s) (Deployments, Services, Probes) and Prometheus metrics exporter at `GET /api/metrics`. |

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

### Option A: Local Development (Native Node.js)

#### 1. Start Backend API Server
```bash
cd server
cp .env.example .env
npm install
npm run dev
# Server will run at http://localhost:5000
```

#### 2. Start Frontend React Application
```bash
# In project root
npm install
npm run dev
# Vite dev server will run at http://localhost:5173
```

---

### Option B: Docker Compose (Recommended One-Click Setup)
Runs MongoDB, Express REST API, and Nginx-powered React Frontend together in isolated containers:

```bash
docker compose up --build
```
- **Frontend UI:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Prometheus Metrics:** [http://localhost:5000/api/metrics](http://localhost:5000/api/metrics)
- **MongoDB Database:** `localhost:27017`

To stop the containers:
```bash
docker compose down
```

---

### Option C: Kubernetes Cluster Deployment
Kubernetes manifests with deployments, services, and health probes are provided under [`k8s/`](./k8s):

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Deploy MongoDB
kubectl apply -f k8s/mongodb-deployment.yaml

# Deploy Backend API & Frontend SPA
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml

# Check cluster pod status
kubectl get pods -n careerconnect
```

---

## 🧪 Testing & Quality Assurance

Run the automated backend test suite (unit and integration tests verifying health check, jobs query, auth validation, and Prometheus metrics):

```bash
# Run tests from root
npm test

# Or run tests directly in server directory
cd server && npm test
```

Build verification for production:
```bash
npm run build
```

---

## 🔄 CI/CD Automation

1. **GitHub Actions ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)):**
   - Triggers on every push & pull request to `master` and `main`.
   - Runs automated API test runner.
   - Builds frontend production distribution.
   - Verifies Docker multi-stage container builds.
2. **Weekly Academic Report Automation ([`.github/workflows/auto_monthly_report.yml`](./.github/workflows/auto_monthly_report.yml)):**
   - Scheduled Saturday night workflow generating official SKIT Form-3 commit progress PDFs.
3. **Jenkins Declarative Pipeline ([`Jenkinsfile`](./Jenkinsfile)):**
   - Multi-stage pipeline covering Checkout, Dependency Installation, Unit Testing, Vite Build, and Docker Image Creation.

---

## 👥 Project Team

- **Yuvraaj Sengar**
- **Kashish Bhati**
- **Zinat Nisa**

**Department of Computer Science & Engineering**  
Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur

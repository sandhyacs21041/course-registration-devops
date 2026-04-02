# 🎓 Course Registration System — DevOps Pipeline

A full-stack Course Registration System with a complete automated DevOps pipeline using **Git → Maven → JUnit → Jenkins → Docker → Deploy**.

---

## 🏗️ Project Structure

```
course-registration-devops/
├── backend/                        ← Spring Boot REST API (Java 17)
│   ├── src/
│   │   ├── main/java/com/courseapp/
│   │   │   ├── CourseRegistrationApplication.java
│   │   │   ├── DataInitializer.java
│   │   │   ├── controller/        ← REST Controllers
│   │   │   ├── model/             ← JPA Entities
│   │   │   ├── repository/        ← Spring Data Repos
│   │   │   └── service/           ← Business Logic
│   │   └── resources/
│   │       └── application.properties
│   ├── src/test/java/com/courseapp/
│   │   ├── CourseServiceTest.java  ← JUnit 5 Tests
│   │   └── StudentServiceTest.java ← JUnit 5 Tests
│   ├── pom.xml                    ← Maven build file
│   └── Dockerfile                 ← Backend container
├── frontend/                      ← React.js UI
│   ├── src/
│   │   ├── App.js
│   │   ├── api.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── CoursesPage.js
│   │   │   └── StudentsPage.js
│   │   ├── components/
│   │   │   ├── CourseModal.js
│   │   │   ├── StudentModal.js
│   │   │   └── Toast.js
│   │   └── styles/index.css
│   ├── public/index.html
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile                 ← Frontend container
├── docker-compose.yml             ← Multi-container orchestration
├── Jenkinsfile                    ← CI/CD Pipeline definition
└── README.md
```

---

## 🚀 STEP-BY-STEP SETUP GUIDE

---

### STEP 1 — Prerequisites (Install These First)

| Tool | Version | Download |
|------|---------|----------|
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.9+ | https://maven.apache.org |
| Node.js | 18+ | https://nodejs.org |
| Git | Latest | https://git-scm.com |
| Docker Desktop | Latest | https://docker.com |
| Jenkins | LTS | https://jenkins.io |

Verify installations:
```bash
java -version
mvn -version
node -version
docker -version
git --version
```

---

### STEP 2 — Git Setup (Source Control)

```bash
# Initialize repository
git init course-registration-devops
cd course-registration-devops

# Copy all project files here, then:
git add .
git commit -m "Initial commit: Course Registration System"

# Push to GitHub (create repo first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/course-registration-devops.git
git push -u origin main
```

---

### STEP 3 — Run Backend Locally (Maven)

```bash
cd backend

# Compile the project
mvn clean compile

# Run JUnit tests
mvn test

# View test report: backend/target/surefire-reports/

# Package into JAR
mvn package -DskipTests

# Run the Spring Boot app
mvn spring-boot:run
```

Backend runs at: **http://localhost:8080**
H2 Console at:  **http://localhost:8080/h2-console**

#### Test the API:
```bash
# Get all courses
curl http://localhost:8080/api/courses

# Get all students
curl http://localhost:8080/api/students

# Create a course
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{"name":"DevOps Basics","code":"DO101","instructor":"Prof. Rao","credits":3,"capacity":25,"schedule":"Fri 9-11AM","status":"OPEN"}'

# Register student (id=1) for course (id=1)
curl -X POST http://localhost:8080/api/students/1/register/1
```

---

### STEP 4 — Run Frontend Locally (React)

```bash
cd frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

### STEP 5 — JUnit Tests Explained

Test files are in `backend/src/test/java/com/courseapp/`:

- **CourseServiceTest.java** — Tests for course CRUD, enrollment logic (10 tests)
- **StudentServiceTest.java** — Tests for student registration, drop course (7 tests)

Run tests:
```bash
cd backend
mvn test

# With coverage report
mvn test jacoco:report
# Report: backend/target/site/jacoco/index.html
```

---

### STEP 6 — Docker (Containerize the App)

```bash
# Build backend image
cd backend
docker build -t course-backend:1.0 .

# Build frontend image
cd ../frontend
docker build -t course-frontend:1.0 .

# Run both with Docker Compose (from project root)
cd ..
docker-compose up --build

# Check running containers
docker ps

# Stop
docker-compose down
```

Access:
- Frontend: **http://localhost:3000**
- Backend:  **http://localhost:8080**

---

### STEP 7 — Jenkins CI/CD Pipeline Setup

#### 7.1 Install Jenkins
```bash
# macOS
brew install jenkins-lts
brew services start jenkins-lts

# Windows: Download installer from https://jenkins.io/download/
# Linux (Ubuntu)
sudo apt update
sudo apt install jenkins
sudo systemctl start jenkins
```

Jenkins runs at: **http://localhost:8080** (if not conflicting with backend, use port 9090)

#### 7.2 Configure Jenkins

1. Open Jenkins → **Manage Jenkins** → **Manage Plugins**
2. Install these plugins:
   - Git Plugin
   - Maven Integration Plugin
   - Docker Pipeline Plugin
   - JUnit Plugin
   - JaCoCo Plugin

3. **Manage Jenkins → Global Tool Configuration**:
   - Add JDK: name=`JDK-17`, path to JAVA_HOME
   - Add Maven: name=`Maven-3.9`, install automatically

4. **Add Docker Hub Credentials**:
   - Manage Jenkins → Manage Credentials
   - Add → Username + Password
   - ID: `dockerhub-credentials`
   - Enter your Docker Hub username/password

#### 7.3 Create Pipeline Job

1. Jenkins Dashboard → **New Item**
2. Name: `course-registration-pipeline`
3. Type: **Pipeline** → OK
4. In Pipeline section:
   - Definition: `Pipeline script from SCM`
   - SCM: Git
   - Repository URL: `https://github.com/YOUR_USERNAME/course-registration-devops.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
5. **Save** → **Build Now**

#### 7.4 Pipeline Stages Explained

```
📁 Checkout → 🔨 Maven Build → 🧪 JUnit Tests → 📦 JAR Package
     ↓
🐳 Docker Build (parallel: backend + frontend)
     ↓
🔐 Push to Docker Hub
     ↓
🚀 Deploy with Docker Compose
     ↓
✅ Health Check
```

---

### STEP 8 — Full Pipeline Flow Diagram

```
Developer
   │
   ▼
git push ──→ GitHub Repo
                │
                ▼ (webhook or manual trigger)
            Jenkins Pipeline
                │
          ┌─────┴─────┐
          ▼           ▼
       Checkout    (if fail → notify)
          │
          ▼
     mvn compile
          │
          ▼
      mvn test (JUnit 5)
          │        │
          ▼        ▼
       Pass     Fail → Stop Pipeline
          │
          ▼
     mvn package → .jar artifact
          │
     ┌────┴────┐
     ▼         ▼
  Docker     Docker
  Build      Build
  Backend    Frontend
     │         │
     └────┬────┘
          ▼
    Push to Docker Hub
          │
          ▼
    docker-compose up
          │
          ▼
    Health Check
          │
          ▼
    ✅ DEPLOYED!
    http://localhost:3000
```

---

## 📡 REST API Reference

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | List all courses |
| GET | /api/courses/{id} | Get course by ID |
| GET | /api/courses/open | Get open courses |
| POST | /api/courses | Create new course |
| PUT | /api/courses/{id} | Update course |
| DELETE | /api/courses/{id} | Delete course |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/students | List all students |
| GET | /api/students/{id} | Get student by ID |
| POST | /api/students | Create student |
| PUT | /api/students/{id} | Update student |
| DELETE | /api/students/{id} | Delete student |
| POST | /api/students/{sId}/register/{cId} | Register for course |
| DELETE | /api/students/{sId}/drop/{cId} | Drop a course |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js 18, Axios |
| Backend | Spring Boot 3.2, Java 17 |
| Database | H2 (in-memory, dev) |
| Build | Maven 3.9 |
| Testing | JUnit 5, Mockito, JaCoCo |
| CI/CD | Jenkins |
| Container | Docker, Docker Compose |
| Web Server | Nginx (frontend) |
| Version Control | Git + GitHub |

---

## ✅ Quick Start (All-in-One)

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/course-registration-devops.git
cd course-registration-devops

# Run entire app with Docker Compose
docker-compose up --build

# Open browser
open http://localhost:3000
```

That's it! 🎉

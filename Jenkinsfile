pipeline {
    agent any

    environment {
        DOCKER_HUB_REPO  = 'yourdockerhubuser'
        BACKEND_IMAGE    = "${DOCKER_HUB_REPO}/course-backend"
        FRONTEND_IMAGE   = "${DOCKER_HUB_REPO}/course-frontend"
        APP_VERSION      = "1.0.${BUILD_NUMBER}"
    }

    tools {
        maven 'Maven-3.9'
        jdk   'JDK-17'
    }

    stages {

        stage('📁 Checkout') {
            steps {
                echo '====== Cloning repository ======'
                git branch: 'main', url: 'https://github.com/YOUR_USERNAME/course-registration-devops.git'
            }
        }

        stage('🔨 Build Backend (Maven)') {
            steps {
                dir('backend') {
                    echo '====== Compiling with Maven ======'
                    sh 'mvn clean compile -B'
                }
            }
        }

        stage('🧪 Run Unit Tests (JUnit)') {
            steps {
                dir('backend') {
                    echo '====== Running JUnit Tests ======'
                    sh 'mvn test -B'
                }
            }
            post {
                always {
                    junit 'backend/target/surefire-reports/*.xml'
                    jacoco(
                        execPattern: 'backend/target/jacoco.exec',
                        classPattern: 'backend/target/classes',
                        sourcePattern: 'backend/src/main/java'
                    )
                }
                failure {
                    echo '❌ Tests failed! Aborting pipeline.'
                    error('JUnit tests failed')
                }
            }
        }

        stage('📦 Package (JAR)') {
            steps {
                dir('backend') {
                    echo '====== Packaging JAR ======'
                    sh 'mvn package -DskipTests -B'
                    archiveArtifacts artifacts: 'target/*.jar', fingerprint: true
                }
            }
        }

        stage('🐳 Build Docker Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('backend') {
                            sh "docker build -t ${BACKEND_IMAGE}:${APP_VERSION} -t ${BACKEND_IMAGE}:latest ."
                        }
                    }
                }
                stage('Frontend Image') {
                    steps {
                        dir('frontend') {
                            sh "docker build -t ${FRONTEND_IMAGE}:${APP_VERSION} -t ${FRONTEND_IMAGE}:latest ."
                        }
                    }
                }
            }
        }

        stage('🔐 Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push ${BACKEND_IMAGE}:${APP_VERSION}
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${APP_VERSION}
                        docker push ${FRONTEND_IMAGE}:latest
                    '''
                }
            }
        }

        stage('🚀 Deploy (Docker Compose)') {
            steps {
                echo '====== Deploying application ======'
                sh '''
                    docker-compose down --remove-orphans || true
                    docker-compose pull
                    docker-compose up -d
                    echo "✅ Application deployed!"
                    echo "Frontend: http://localhost:3000"
                    echo "Backend:  http://localhost:8080"
                '''
            }
        }

        stage('✅ Health Check') {
            steps {
                sleep(15)
                sh '''
                    echo "Checking backend health..."
                    curl -f http://localhost:8080/api/courses || exit 1
                    echo "✅ Backend is healthy!"
                '''
            }
        }
    }

    post {
        success {
            echo """
            ╔══════════════════════════════════════╗
            ║  ✅ PIPELINE COMPLETED SUCCESSFULLY  ║
            ║  Version: ${APP_VERSION}             ║
            ║  Frontend → http://localhost:3000    ║
            ║  Backend  → http://localhost:8080    ║
            ╚══════════════════════════════════════╝
            """
        }
        failure {
            echo '❌ Pipeline FAILED. Check logs above.'
        }
        always {
            cleanWs()
        }
    }
}

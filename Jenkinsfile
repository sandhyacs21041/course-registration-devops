pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo "Cloning GitHub repository..."
                git branch: 'main', url: 'https://github.com/sandhyacs21041/course-registration-devops.git'
            }
        }

        stage('Build Backend') {
            steps {
                dir('backend') {
                    echo "Building backend with Maven..."
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Docker images..."
                sh 'docker build -t course-backend ./backend'
                sh 'docker build -t course-frontend ./frontend'
            }
        }

        stage('Run Containers') {
            steps {
                echo "Running Docker containers..."
                sh 'docker stop course-backend || true'
                sh 'docker stop course-frontend || true'
                sh 'docker rm course-backend || true'
                sh 'docker rm course-frontend || true'

                sh 'docker run -d -p 8080:8080 --name course-backend course-backend'
                sh 'docker run -d -p 3000:3000 --name course-frontend course-frontend'
            }
        }

        stage('Health Check') {
            steps {
                echo "Checking backend health..."
                sleep 10
                sh 'curl -f http://localhost:8080 || exit 1'
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
            echo "Frontend: http://localhost:3000"
            echo "Backend: http://localhost:8080"
        }
        failure {
            echo "Pipeline failed. Check logs."
        }
    }
}
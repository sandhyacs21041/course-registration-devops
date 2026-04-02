pipeline {
    agent any

    stages {

        stage('Checkout Code') {
            steps {
                echo "Cloning repository from GitHub..."
                git branch: 'main', url: 'https://github.com/sandhyacs21041/course-registration-devops.git'
            }
        }

        stage('Build Backend') {
            steps {
                echo "Building Spring Boot backend..."
                bat 'cd backend && mvn clean package -DskipTests'
            }
        }

        stage('Run Tests') {
            steps {
                echo "Running backend tests..."
                bat 'cd backend && mvn test'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                bat 'cd backend && docker build -t course-backend .'
            }
        }

        stage('Run Docker Container') {
            steps {
                echo "Running Docker container..."

                bat 'docker stop course-backend-container || exit 0'
                bat 'docker rm course-backend-container || exit 0'

                bat 'docker run -d -p 8090:8080 --name course-backend-container course-backend'
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
            echo "Backend running at http://localhost:8080"
        }
        failure {
            echo "Pipeline failed. Check Jenkins logs."
        }
    }
}
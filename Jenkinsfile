pipeline {
    agent any

    environment {
        CI = 'true'
        NODE_ENV = 'production'
        DOCKER_IMAGE_BACKEND = 'careerconnect-backend:latest'
        DOCKER_IMAGE_FRONTEND = 'careerconnect-frontend:latest'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing root and server dependencies...'
                sh 'npm ci'
                sh 'npm --prefix server ci'
            }
        }

        stage('Run Backend API Tests') {
            steps {
                echo 'Running automated Node.js unit and integration tests...'
                sh 'npm test'
            }
        }

        stage('Build Frontend Bundle') {
            steps {
                echo 'Building React 19 Single Page Application with Vite...'
                sh 'npm run build'
            }
        }

        stage('Docker Container Build') {
            steps {
                echo 'Building Docker container images for microservices...'
                sh 'docker build -t ${DOCKER_IMAGE_BACKEND} -f Dockerfile.server .'
                sh 'docker build -t ${DOCKER_IMAGE_FRONTEND} -f Dockerfile.client .'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'CI/CD Build & Verification completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Please review step logs.'
        }
    }
}

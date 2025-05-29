pipeline {
  agent any
  tools {
    nodejs 'NodeJS 24.0.2'
  }
  environment {
    CI = 'true'
    IMAGE_NAME = 'rabtens/jenkins-node-app'
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
    }
    stage('Docker Build & Push') {
      steps {
        script {
          docker.withRegistry('', 'dockerhub') {
            def app = docker.build("${IMAGE_NAME}:${env.BUILD_NUMBER}")
            app.push()
          }
        }
      }
    }
  }
}

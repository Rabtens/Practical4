def call(Map config = [:]) {
  pipeline {
    agent any
    tools {
      nodejs 'NodeJS-20.x'
    }
    environment {
      DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }
    stages {
      stage('Install') {
        steps {
          sh 'npm install'
        }
      }
      stage('Test') {
        steps {
          sh 'npm test -- --ci --reporters=jest-junit'
        }
        post {
          always {
            junit 'junit.xml'
          }
        }
      }
      stage('Build Docker Image') {
        steps {
          script {
            dockerImage = docker.build("${config.imageName}:${env.BUILD_NUMBER}")
          }
        }
      }
      stage('Push to DockerHub') {
        steps {
          script {
            docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
              dockerImage.push()
            }
          }
        }
      }
    }
  }
}

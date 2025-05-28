pipeline {
  agent any
  tools {
    nodejs 'NodeJS 24.0.2'  // This must match your Global Tool name in Jenkins
  }
  stages {
    stage('Install') {
      steps {
        sh 'npm install'
      }
    }
    stage('Test') {
      steps {
        sh 'npm test'
      }
      post {
        always {
          junit 'junit.xml'
        }
      }
    }
    stage('Build') {
      steps {
        sh 'echo "Build step skipped (no build command for basic Node app)"'
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo "Deploying to staging..."'
      }
    }
  }
}

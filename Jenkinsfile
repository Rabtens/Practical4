pipeline {
  agent any
  tools {
    nodejs 'NodeJS 24.0.2'
  }
  environment {
    CI = 'true'
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
    stage('Deploy') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            echo 'Deploying to production...'
          } else {
            echo 'Deploying to staging...'
          }
        }
      }
    }
  }
}

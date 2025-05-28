pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20.x'  // Make sure this matches your Jenkins NodeJS installation name
    }
    
    environment {
        NODE_ENV = 'test'
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from repository...'
                // Git checkout is automatic when using Pipeline script from SCM
                sh 'ls -la'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js dependencies...'
                sh 'npm ci'  // Use npm ci for faster, reliable, reproducible builds
                sh 'npm list --depth=0'
            }
        }
        
        stage('Lint') {
            steps {
                echo 'Running ESLint...'
                sh 'npm run lint || true'  // Don't fail build on linting errors
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'npm test'
            }
            post {
                always {
                    // Archive test results
                    junit 'junit.xml'
                    
                    // Archive coverage reports
                    publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'npm run build'
            }
        }
        
        stage('Security Scan') {
            steps {
                echo 'Running security audit...'
                sh 'npm audit --audit-level=high || true'  // Don't fail on security issues
            }
        }
        
        stage('Archive Artifacts') {
            steps {
                echo 'Archiving artifacts...'
                archiveArtifacts artifacts: 'app.js,package.json,README.md', fingerprint: true
            }
        }
        
        stage('Deploy to Staging') {
            when {
                branch 'main'  // Only deploy main branch
            }
            steps {
                echo 'Deploying to staging environment...'
                sh '''
                    echo "Deployment steps would go here"
                    echo "Current directory: $(pwd)"
                    echo "Files to deploy: $(ls -la)"
                    echo "Deployment completed successfully"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed.'
            cleanWs()  // Clean workspace after build
        }
        success {
            echo 'Pipeline succeeded!'
            // You can add notifications here (email, Slack, etc.)
        }
        failure {
            echo 'Pipeline failed!'
            // You can add failure notifications here
        }
        unstable {
            echo 'Pipeline is unstable!'
        }
    }
}
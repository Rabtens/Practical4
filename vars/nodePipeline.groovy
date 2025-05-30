def call(Map config = [:]) {
    def appDir = config.appDir ?: '.'
    
    pipeline {
        agent any
        
        stages {
            stage('Checkout') {
                steps {
                    checkout scm
                }
            }
            
            stage('Install Dependencies') {
                steps {
                    script {
                        nodeInstall(
                            nodeVersion: config.nodeVersion ?: '18',
                            installCommand: config.installCommand ?: 'npm install',
                            appDir: appDir
                        )
                    }
                }
            }
            
            stage('Run Tests') {
                steps {
                    script {
                        nodeTest(
                            nodeVersion: config.nodeVersion ?: '18',
                            testCommand: config.testCommand ?: 'npm test',
                            appDir: appDir
                        )
                    }
                }
            }
            
            stage('Build Docker Image') {
                steps {
                    script {
                        dockerBuild(
                            imageName: config.imageName,
                            tag: config.tag ?: "${env.BUILD_NUMBER}",
                            dockerfilePath: config.dockerfilePath ?: 'Dockerfile',
                            appDir: appDir
                        )
                    }
                }
            }
            
            stage('Push to Registry') {
                steps {
                    script {
                        dockerPush(
                            imageName: config.imageName,
                            tag: config.tag ?: "${env.BUILD_NUMBER}",
                            credentials: config.credentials ?: 'dockerhub-credentials'
                        )
                    }
                }
            }
        }
        
        post {
            always {
                cleanWs()
            }
            failure {
                echo "Pipeline failed!"
            }
        }
    }
}
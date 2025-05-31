def call(Map config = [:]) {
    pipeline {
        agent any

        tools {
            nodejs 'NodeJS 24.0.2'
        }

        environment {
            DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        }

        stages {
            stage('Install') {
                steps {
                    dir('app') {
                        sh 'npm install'
                    }
                }
            }

            stage('Test') {
                steps {
                    dir('app') {
                        sh 'npm test'
                    }
                }
            }

            stage('Build Docker Image') {
                steps {
                    script {
                        def dockerImage = docker.build("${config.imageName}", "app/.")
                    }
                }
            }

            stage('Push to DockerHub') {
                steps {
                    script {
                        docker.withRegistry('https://index.docker.io/v1/', DOCKERHUB_CREDENTIALS) {
                            dockerImage.push()
                        }
                    }
                }
            }
        }
    }
}

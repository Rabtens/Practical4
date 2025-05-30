def call(Map config = [:]) {
    pipeline {
        agent any

        environment {
            DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
            IMAGE_NAME = "${config.imageName ?: 'default-node-image'}"
        }

        stages {
            stage('Install Dependencies') {
                steps {
                    echo "Installing packages..."
                    sh 'npm install'
                }
            }

            stage('Run Tests') {
                steps {
                    echo "Running tests..."
                    sh 'npm test'
                }
            }

            stage('Build Docker Image') {
                steps {
                    echo "Building Docker image..."
                    sh "docker build -t $IMAGE_NAME ."
                }
            }

            stage('Push to DockerHub') {
                steps {
                    echo "Pushing Docker image..."
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) {
                        sh """
                            echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
                            docker tag $IMAGE_NAME $USERNAME/$IMAGE_NAME
                            docker push $USERNAME/$IMAGE_NAME
                        """
                    }
                }
            }
        }

        post {
            always {
                echo 'Pipeline complete.'
            }
        }
    }
}

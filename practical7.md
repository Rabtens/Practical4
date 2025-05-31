Practical 7: Creating Shared Library in Jenkins
Course: DSO101 - Continuous Integration and Continuous Deployment
Submitted by: Kuenzang Rabten
Date: 31st May, 2025
Overview
This practical is about creating a Shared Library in Jenkins that can be reused across multiple Node.js projects. The goal is to centralize commonly used pipeline steps like installing dependencies, running tests, building Docker images, and pushing to DockerHub.

Using a shared library promotes consistency, reduces duplication, and simplifies maintenance of Jenkins pipelines in larger projects or organizations.

Prerequisites
Before starting the practical, I ensured the following were installed and configured:

Jenkins (locally or on a cloud instance)

A GitHub repository for storing the shared library

Docker installed and configured

DockerHub account with access credentials

Jenkins credentials for DockerHub (configured under Manage Jenkins → Credentials)

Node.js projects using npm and Jest for testing

Step 1: Created a Shared Library Repository
Created a new GitHub repository named jenkins-shared-library.

Added the required directory structure:

bash
Copy
Edit
jenkins-shared-library/
├── vars/
│   └── nodePipeline.groovy
├── src/
│   └── org/example/Utilities.groovy
└── README.md
Step 2: Wrote the Shared Library Script
Created a nodePipeline.groovy file inside the vars/ directory with the following logic:

groovy
Copy
Edit
def call(Map config = [:]) {
  pipeline {
    agent any
    tools {
      nodejs 'NodeJS-20.x'
    }
    environment {
      DOCKERHUB_CREDENTIALS = credentials('dockerhub-creds')
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
            docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-creds') {
              dockerImage.push()
            }
          }
        }
      }
    }
  }
}
Step 3: Configured Jenkins to Use Shared Library
Went to Manage Jenkins → Configure System.

Scrolled to Global Pipeline Libraries.

Added a new library with:

Name: shared-lib

Default version: main

Retrieval method: Modern SCM → Git

Project Repository: https://github.com/Rabtens/jenkins-shared-library.git

Step 4: Created a Project Jenkinsfile
In the Node.js project repository, created a Jenkinsfile that uses the shared library:

groovy
Copy
Edit
@Library('shared-lib') _
nodePipeline(imageName: 'rabtens/my-node-app')
This loads the shared library and executes the standardized pipeline logic using nodePipeline().

Step 5: Running the Pipeline
Triggered the pipeline by clicking Build Now in Jenkins. Jenkins fetched the shared library and ran all the defined stages.

Challenge Completed: DockerHub Push
To complete the challenge, I implemented Docker image building and automatic pushing to DockerHub using Jenkins credentials and the Docker pipeline plugin.

Created a DockerHub credential in Jenkins (dockerhub-creds).

Used docker.withRegistry to authenticate and push images.

Configured DockerHub repo visibility and tags using the Jenkins build number.

Output and Screenshots




After running the pipeline, here’s what I observed:

Install: npm dependencies installed successfully.

Test: Jest ran tests and generated a junit.xml report.

Docker Build: Image created with correct tags.

Docker Push: Image successfully pushed to DockerHub.

Key Learnings
Learned how to structure and create a Jenkins Shared Library.

Understood how to centralize reusable pipeline code for Node.js projects.

Learned how to automate Docker image creation and push with Jenkins credentials.

Gained experience in combining CI/CD best practices with Jenkins libraries.

Conclusion
This practical focused on creating a reusable Jenkins shared library to streamline CI/CD steps across Node.js projects. The shared library approach reduces duplication, improves consistency, and simplifies the management of Jenkins pipelines.

Working through this practical helped reinforce the importance of modular design in DevOps pipelines and showed how shared libraries make Jenkins more scalable and maintainable.
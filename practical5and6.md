# Practicals 5 and 6: Declarative Pipeline for Jenkins and Using External Services

## Module: DSO101 - Continuous Integration and Continuous Deployment  
**Submitted by:** Kuenzang Rabten  
**Date:** 29th May, 2025  

---

## Overview

These practicals focused on creating **Jenkins Declarative Pipelines** for Node.js applications and integrating them with external services like Docker Hub. The work was divided into two parts:
- Building a basic automated pipeline
- Extending it with Docker functionality for containerized deployments

This exercise covered writing pipeline scripts as code, automating builds and tests, creating Docker images, and pushing them to container registries securely.

---

## Prerequisites

Before starting, the following were set up:

- Jenkins server with admin access
- Node.js (version 20.x)
- npm package manager
- Git repository with a Node.js project
- Docker installed on Jenkins server
- Docker Hub account for image registry

---

## Step 1: Configure Jenkins for Node.js Projects

1. Navigate to `Manage Jenkins` → `Manage Plugins` → `Available`
2. Installed the following plugins:
   - **NodeJS Plugin**
   - **Git Plugin**
   - **Pipeline Plugin**
   - **Docker Pipeline Plugin** (for Part 2)

---

## Step 2: Set Up Node.js Runtime

1. Go to `Manage Jenkins` → `Global Tool Configuration`
2. Under **NodeJS**, added:
   - **Name:** `NodeJS-20.x`
   - **Version:** Node.js 20.x LTS
   - **Global npm packages:** (left empty)

---

## Step 3: Create Pipeline Job

1. In Jenkins dashboard, click `New Item`
2. Name the job: `nodejs-declarative-pipeline`
3. Select `Pipeline` → Click OK
4. In configuration:
   - **Definition:** Pipeline script from SCM
   - **SCM:** Git
     - **Repository URL:** `https://github.com/Rabtens/jenkins-nodejs-pipeline`
   - **Script Path:** `Jenkinsfile`

---

## Step 4: Part 1 - Basic Declarative Pipeline

**Jenkinsfile** contents:

```groovy
pipeline {
  agent any
  tools {
    nodejs 'NodeJS-20.x'
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
      post {
        always {
          junit 'junit.xml'
        }
      }
    }
    stage('Deploy') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            sh 'npm run deploy:prod'
          } else {
            sh 'npm run deploy:stage'
          }
        }
      }
    }
  }
}
```
Sure! Here's your content formatted for a `README.md` file using markdown syntax with `#` for headings and `-` for list items:

# Step 5: Part 2 - Docker Integration Challenge

## Docker Hub Credentials Setup
- Go to Manage Jenkins → Manage Credentials
- Under (global) domain → Add Credentials
  - **Kind:** Username with password
  - **ID:** dockerhub-credentials
  - **Username/Password:** Docker Hub login

## Dockerfile
Added to project root:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
````

## Updated Jenkinsfile with Docker Stages

```groovy
pipeline {
  agent any
  tools {
    nodejs 'NodeJS-20.x'
  }
  environment {
    CI = 'true'
    DOCKER_IMAGE = 'rabtens/nodejs-app'
    DOCKER_TAG = "${BUILD_NUMBER}"
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
      post {
        always {
          junit 'junit.xml'
        }
      }
    }
    stage('Build Docker Image') {
      steps {
        script {
          docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
          docker.build("${DOCKER_IMAGE}:latest")
        }
      }
    }
    stage('Push to Docker Hub') {
      steps {
        script {
          docker.withRegistry('https://registry-1.docker.io/v2/', 'dockerhub-credentials') {
            docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}").push()
            docker.image("${DOCKER_IMAGE}:latest").push()
          }
        }
      }
    }
    stage('Deploy') {
      steps {
        script {
          if (env.BRANCH_NAME == 'main') {
            sh 'echo "Deploying to production..."'
            sh 'docker run -d --name nodejs-app-prod -p 3000:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}'
          } else {
            sh 'echo "Deploying to staging..."'
            sh 'docker run -d --name nodejs-app-stage -p 3001:3000 ${DOCKER_IMAGE}:${DOCKER_TAG}'
          }
        }
      }
    }
  }
  post {
    always {
      sh 'docker system prune -f'
    }
  }
}
```

## Step 6: Running the Pipeline

By clicking **Build Now**, Jenkins executed all stages:

* Install dependencies
* Build application
* Run tests (Jest)
* Create Docker images
* Push to Docker Hub
* Deploy containers (staging or production)

## Problems Faced and Solutions

### Docker Permission Issues

* **Issue:** Jenkins couldn't access Docker
* **Solution:** Added Jenkins user to Docker group:

```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### Credential Authentication Failures

* **Issue:** Failed to push to Docker Hub
* **Solution:** Verified that the credential ID matched in the Jenkinsfile and Jenkins Credentials store.

### Test Stage Failures

* **Issue:** Jest test reports missing
* **Solution:** Updated `package.json` with `jest-junit`:

```json
{
  "scripts": {
    "test": "jest --ci --reporters=jest-junit"
  },
  "jest-junit": {
    "outputDirectory": ".",
    "outputName": "junit.xml"
  }
}
```

## Output and Results

* Part 1: Basic CI/CD pipeline built, tested, and deployed the Node.js app
* Part 2: Docker images built and pushed to Docker Hub with proper tags
* **Docker Hub:** Image tags appeared (latest, build number)

![alt text](<outputimages/Screenshot from 2025-05-29 21-04-33.png>)

![alt text](<outputimages/Screenshot from 2025-05-29 21-08-35.png>)

![alt text](<outputimages/Screenshot from 2025-05-29 21-27-22.png>)

![alt text](<outputimages/Screenshot from 2025-05-29 21-45-47.png>)

![alt text](<outputimages/Screenshot from 2025-05-29 22-02-11.png>)

![alt text](<outputimages/Screenshot from 2025-05-29 22-15-51.png>)

## Key Learnings

* Declarative syntax is more readable than scripted pipelines
* Pipeline as code ensures versioning and transparency
* Docker simplifies consistent deployment
* Jenkins credentials protect sensitive data
* Jenkins + Docker Hub is a powerful external service integration

## References

* Jenkins Pipeline with Docker Hub
* GCore DevOps Tutorial
* Jenkins Declarative Pipeline Docs

## Conclusion

This practical gave hands-on experience with modern DevOps workflows. The combination of Jenkins declarative pipelines and Docker containerization enables seamless automation of testing, building, and deploying applications. These practices are crucial for real-world CI/CD workflows and software delivery reliability.





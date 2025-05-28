# Practical 4: Jenkins Server for a Git Repository

## Course: DSO101 - Continuous Integration and Continuous Deployment  
## Submitted by: Kuenzang Rabten  
## Date: 28th May, 2025  

---

## Overview

This practical is about setting up a **Jenkins CI/CD pipeline** for a Node.js project stored in a Git repository. Jenkins is a popular tool for automating software build, test, and deployment processes.

In this exercise, I configured Jenkins to automatically install dependencies, run tests, build the app, and simulate deployment. I also added test reports using the JUnit plugin.

---

## Prerequisites

Before starting the practical, I ensured the following were installed:

- Jenkins (locally or on a cloud instance)
- Node.js (version 20.x)
- npm (Node package manager)
- A GitHub repository with a simple Node.js project

---

## Step 1: Installed Required Jenkins Plugins

In Jenkins dashboard:

1. Go to `Manage Jenkins` → `Manage Plugins`.
2. Installed the following plugins:
   - **NodeJS Plugin**
   - **Git Plugin**
   - **Pipeline Plugin**

---

## Step 2: Configure Node.js in Jenkins

1. Go to `Manage Jenkins` → `Global Tool Configuration`.
2. Under **NodeJS**, added a new Node.js installation:
   - Name: `NodeJS-20.x`
   - Version: `20.x` (Automatically install)

---

## Step 3: Created a Pipeline Job

1. Clicked `New Item` → Entered a job name.
2. Selected `Pipeline` → Clicked OK.
3. In job configuration:
   - **Definition**: Pipeline script from SCM
   - **SCM**: Git
     - Repo URL: `https://github.com/Rabtens/Practical4`
   - **Script Path**: `Jenkinsfile`

---

## Step 4: Jenkinsfile Script

Below is the `Jenkinsfile` used in the project:

```groovy
pipeline {
  agent any
  tools {
    nodejs 'NodeJS-20.x'  // Matches the name from Global Tool Configuration
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
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        sh 'echo "Deploying to staging..."'
        // Add real deployment steps here if needed
      }
    }
  }
}
```

## Step 5: Running the Pipeline

I triggered the pipeline manually by clicking **Build Now** in Jenkins.

> Optional:  
You can also configure a **Git webhook** so Jenkins builds the project automatically whenever new code is pushed to the repository.

---

## Challenge Completed: Added Test Reporting

To complete the challenge section, I added automated test reporting to Jenkins.

Here’s what I did:

1. **Installed the JUnit Plugin** from the Jenkins Plugin Manager.
2. **Updated the Test stage** in the Jenkinsfile to use `jest-junit`.
3. **Added a `post` block** to publish test results to the Jenkins UI.

---

### Installing Required Packages

In the terminal, I installed the required testing packages:

```bash
npm install --save-dev jest jest-junit
```

## Updated `package.json`

I updated the `package.json` file to make sure Jest can generate test reports using `jest-junit`.

```json
"scripts": {
  "test": "jest"
},
"jest-junit": {
  "outputDirectory": ".",
  "outputName": "junit.xml"
}
```

This setup ensures that Jest creates a JUnit-style report named junit.xml after running the tests.

## Updated Jenkinsfile (Test Stage)
I modified the Test stage in the Jenkinsfile to generate test reports and publish them in Jenkins.

```groovy
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
```

Note: This uses the jest-junit reporter and ensures that test results are always published after the test stage runs.

## Output and Screenshots

![alt text](<outputimage/Screenshot from 2025-05-28 21-08-52.png>)

![alt text](<outputimage/Screenshot from 2025-05-28 21-09-24.png>)

![alt text](<outputimage/Screenshot from 2025-05-28 21-10-08.png>)

![alt text](<outputimage/Screenshot from 2025-05-28 21-10-44.png>)

After running the pipeline in Jenkins, here’s what I observed:

- Install: All dependencies installed without issues.

- Test: All tests executed using Jest.

- Build: The application built successfully.

- Deploy: A message confirming simulated deployment was displayed.

- Test Report: junit.xml was generated and shown under the Test Results section in Jenkins.

- Logs: Jenkins logs clearly displayed each step of the pipeline.

## Key Learnings
- Learned how to manually trigger a pipeline using Jenkins.

- Understood how to automate testing using Jest and generate test reports with jest-junit.

- Discovered how to display test reports visually using the JUnit Plugin in Jenkins.

- Saw the value of automated testing in CI/CD pipelines to improve code quality and delivery.

---

## Conclusion
This part of the practical focused on adding test automation and reporting to a Jenkins CI/CD pipeline. It showed how tools like Jest, jest-junit, and the JUnit Plugin can be combined to improve the visibility and reliability of automated tests.

Working through this helped me better understand how automated testing fits into modern DevOps practices, especially in continuous integration workflows.
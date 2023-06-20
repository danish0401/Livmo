pipeline {
  agent any
  stages {
    stage("verify tooling") {
      steps {
        sh '''
          docker version
          docker info
          docker-compose version 
          curl --version
          jq --version
        '''
      }
    }
    stage('Start container') {
      steps {
        sh '''
        docker-compose down
        '''
      }
    }
    stage('Run tests against the container') {
      steps {
        sh 'curl -I http://localhost:80'
      }
    }
  }
}
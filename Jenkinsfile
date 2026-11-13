pipeline {
    agent any

    options {
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Node dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Install Playwright browser') {
            steps {
                sh 'npx playwright install --with-deps chromium'
            }
        }

        stage('Run Playwright tests') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Publish the HTML report as a downloadable build artifact.
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**',
                             allowEmptyArchive: true

            // Publish JUnit-style test results if the project produces them.
            // This sample uses Playwright's HTML reporter; see README for
            // optional JUnit reporter configuration.
        }

        success {
            echo 'Playwright test run completed successfully.'
        }

        failure {
            echo 'Playwright pipeline or tests failed. Review Console Output and artifacts.'
        }
    }
}

#!/usr/bin/env groovy


// Update build display name
currentBuild.displayName = "#${BUILD_NUMBER} | ${params.ENVIRONMENT} - [${params.GIT_REPO_BRANCH}]"

// Initialise global variables
aiappsPipelineUtils.setOciEnvConfig(env.OCIENVYML)
aiappsPipelineUtils.setDeploymentEnv(params.ENVIRONMENT)

properties([
        buildDiscarder(logRotator(daysToKeepStr: '60', numToKeepStr: '60', artifactDaysToKeepStr: '60', artifactNumToKeepStr: '60')),
        disableConcurrentBuilds(),
        parameters([
                choice(name: 'ENVIRONMENT', choices: ['QA', 'DEV', 'STAGIF', 'PROD'], description: 'Environment'),
                string(name: 'GIT_REPO_BRANCH', defaultValue: 'main', description: 'Branch Name'),
        ])
])

pipeline {
    agent {
        agent 'sample-label'
    }

    tools { nodejs 'nodejs-17.5.0' }

    stages {
        stage('Initialise') {
                stage('Install Packages') {
                    steps {
                        script {
                            env.EMAIL_TO = 'christianbalangatan@yahoo.com'
                            env.BUILD_TRIGGER_BY = buildCause.userName ?: buildCause.shortDescription.replace('Started by remote host ', '')
                            env.EMAIL_PARAMS = paramsMessage
                            String paramsMessage = 'Parameters used in this build:'
                            params.each { param ->
                                env.EMAIL_PARAMS += "<br>${param.key}: ${param.value}"
                            }
                        }
                            try {
                                sh(
                                    label: 'Build: Installing npm packages',
                                    script: '''
                                        npm install -f
                                    '''
                                )
                                println '[SUCCESS] NodeJS initialized'
                            } catch (Exception e) {
                                println '[ERROR] Failed to initialize NodeJS'
                                currentBuild.result = 'FAILURE'
                                throw e
                            }
                        }

                         // Install Chrome
                        sh 'sudo apt-get install -y google-chrome-stable'

                        // Install Firefox
                        sh 'sudo apt-get install -y firefox'

                        // Install Microsoft Edge (Chromium-based)
                        sh '''
                            curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
                            sudo mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
                            sudo sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/edge stable main" > /etc/apt/sources.list.d/microsoft-edge-dev.list'
                            sudo apt update
                            sudo apt install -y microsoft-edge-dev
                        '''
                    }
                }
        

        stage('Run Tests') {
            parallel {
                stage('Jupiter Toys Tests - chrome') {
                    steps {
                        script {
                            sh "BASE_URL=https://jupiter.cloud.planittesting.com/#/ RUNTIME_BROWSER=firefox LOG_LEVEL=info npm run test"

                        }
                    }
                }

                stage('Jupiter Toys Tests - firefox') {
                    steps {
                        script {
                            sh "BASE_URL=https://jupiter.cloud.planittesting.com/#/ RUNTIME_BROWSER=firefox LOG_LEVEL=info npm run test"
                        }
                    }
                }

                stage('Jupiter Toys Tests - edge') {
                    steps {
                        script {
                            sh "BASE_URL=https://jupiter.cloud.planittesting.com/#/ RUNTIME_BROWSER=edge LOG_LEVEL=info npm run test"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'allure-results/*, logs/*'
            allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
            script {
                try {
                    echo "Sending email notification to '${env.EMAIL_TO}'..."
                    mail(
                        to: "${env.EMAIL_TO}",
                        cc: '',
                        bcc: '',
                        subject: "${currentBuild.result}: ${env.JOB_NAME} build execution",
                        from: '',
                        replyTo: '',
                        mimeType: 'text/html',
                        charset: 'UTF-8',
                        body: """<b>${env.JOB_NAME} job ${BUILD_TRIGGER_BY} has completed with ${currentBuild.result} status.</b><br>
                                See allure test report: ${env.BUILD_URL}allure <br>
                                Build Number: ${env.BUILD_NUMBER} <br>
                                URL build: ${env.BUILD_URL} <br>
                                ${env.EMAIL_PARAMS}"""
                    )
                } catch (Exception e) {
                    echo "[ERROR] Failed to send email notification to '${env.EMAIL_TO}' with error:\n${e}"
                }

                 cleanWs()
            }
        }
    }
}

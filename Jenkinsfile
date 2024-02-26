//Define variables
env.NODE_LABEL = 'sefags217'

//Define Artifact env
env.WEB_CLI_DIR = 'recognizer-web-client'
env.WEB_CLI_ARTIFACT = 'recognizer-web-client.zip'
//env.WEB_CLI_LINK = 'recognizer-web-client\\recognizer-web-client.zip'

//define if it is a PUSH to the branch or a MERGE request 
env.BUILD_TYPE='PUSH'
if (env.CHANGE_ID) {
	env.BUILD_TYPE='MERGE'
	echo "Short build for MERGE request"
}

def cleanUpWS (boolean hardClean) {
	if (hardClean) {
		cleanWs (notFailBuild: true)
	} else {
		bat """
			git.exe reset --hard
			git.exe clean -fdx
		"""
    }
}


pipeline {
	agent {
		node {
			label env.NODE_LABEL
		}
	}
	stages {
		stage ('Build develop web-Client') {
			environment {
				WEB_API_URL = 'https://sefags1340.secotools.net:4343/api'
				SITE_HOSTNAME = 'https://sefags1340.secotools.net:4343'
				REACT_APP_VERSION = "0.0.${env.BUILD_NUMBER}"
			}
			when {
				branch 'develop'
			}	
			steps {
				timestamps {
					
					script {
						
						bat '''
							@echo off
							echo === NPM Install ===
							echo %BUILD_ID%
							echo %REACT_APP_VERSION%
							npm install
						'''
						bat '''
							@echo off
							echo === Build web-client ===
							npm run build
						'''
					}
				}
			}
		}
		stage ('Build stage web-Client') {
			environment {
				WEB_API_URL = 'https://component-guidance.secotools.net/api'
				SITE_HOSTNAME = 'https://component-guidance.secotools.net'
				REACT_APP_VERSION = "0.0.${env.BUILD_NUMBER}"
			}
			when {
				branch 'stage'
			}	
			steps {
				timestamps {
					
					script {
						
						bat '''
							@echo off
							echo === NPM Install ===
							echo %BUILD_ID%
							echo %REACT_APP_VERSION%
							npm install
						'''
						bat '''
							@echo off
							echo === Build web-client ===
							npm run build
						'''
					}
				}
			}
		}
			stage ('Prepear develop web-client Artifacts') {	
			when {
				branch 'develop'
				equals expected: 'PUSH', actual: env.BUILD_TYPE
			}
			steps {
				timestamps {
					
					script {
						powershell """
                            \$siteName = "dev-seco"
                            \$serverName = "sefags1340.secotools.net"
                            \$stopSite = {Stop-WebSite \$args[0]};
                            \$startSite = {Start-WebSite \$args[0]};
                            \$session = New-PSSession \$serverName
                            echo "==== Stop Site ====="
                            Invoke-Command -Session \$session -ScriptBlock \$stopSite -ArgumentList \$siteName
							echo "==== Remove old item ====="
                            Invoke-Command -Session \$session {Remove-Item C:\\inetpub\\wwwroot\\dev\\front\\* -Recurse -Force}
                            echo "==== copy item ====="
                            Copy-Item -Path \$ENV:WORKSPACE\\public\\* -Destination C:\\inetpub\\wwwroot\\dev\\front\\ -ToSession \$session -Recurse -Force
                            echo "==== Start Site ====="
                            Invoke-Command -Session \$session -ScriptBlock \$startSite -ArgumentList \$siteName
                        """	
					}
				}
			}
		}
			stage ('Prepear stage web-client Artifacts') {	
			when {
				branch 'stage'
				equals expected: 'PUSH', actual: env.BUILD_TYPE
			}
			steps {
				timestamps {
					
					script {
						powershell """
                            \$siteName = "Default Web Site"
                            \$serverName = "sefags1340.secotools.net"
                            \$stopSite = {Stop-WebSite \$args[0]};
                            \$startSite = {Start-WebSite \$args[0]};
                            \$session = New-PSSession \$serverName
                            echo "==== Stop Site ====="
                            Invoke-Command -Session \$session -ScriptBlock \$stopSite -ArgumentList \$siteName
							echo "==== Remove old item ====="
                            Invoke-Command -Session \$session {Remove-Item C:\\inetpub\\wwwroot\\front\\* -Recurse -Force}
                            echo "==== copy item ====="
                            Copy-Item -Path \$ENV:WORKSPACE\\public\\* -Destination C:\\inetpub\\wwwroot\\front\\ -ToSession \$session -Recurse -Force
                            echo "==== Start Site ====="
                            Invoke-Command -Session \$session -ScriptBlock \$startSite -ArgumentList \$siteName
                        """	
					}
				}
			}
		}
	}
	post {
		failure {
			script {
				cleanUpWS (false) //false -- soft clean, true -- hard clean, deleting workspace
			}
		}
		success {
			script {
				cleanUpWS (false) //false -- soft clean, true -- hard clean, deleting workspace
			}
		}
		unstable {
			script {
				cleanUpWS (false) //false -- soft clean, true -- hard clean, deleting workspace
			}
		}
	}
}

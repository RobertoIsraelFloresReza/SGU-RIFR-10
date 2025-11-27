pipeline {
    agent any
    environment {
        // Definir variables de entorno si es necesario
        PATH = "/usr/local/bin:${env.PATH}"
    }


    stages {
        stage('Parando los servicios') {
            steps {
                bat '''
                    docker-compose -p sgu-rifr-10 down || true
                '''
            }
        }

        stage('Borrando imágenes antiguas') {
            steps {
                bat '''
                    for /f "tokens=*" %%i in ('docker images --filter "label=com.docker.compose.project=sgu-rifr-10" -q') do (
                        docker rmi -f %%i
                    )
                    if errorlevel 1 (
                        echo No hay imágenes por eliminar
                    ) else (
                        echo Imágenes eliminadas correctamente
                    )
                '''
            }
        }

        stage('Actualizando...') {
            steps {
                checkout scm
            }
        }

        stage('Construyendo y desplegando...') {
            steps {
                bat '''
                    docker compose up --build -d
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutado correctamente.'
        }
        failure {
            echo 'Error al ejecutar el pipeline.'
        }
        always {
            echo 'Pipeline finalizado.'
        }
    }
}
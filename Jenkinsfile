pipeline {
    agent any
    environment {
        // Definir variables de entorno si es necesario
        PATH = "/usr/local/bin:${env.PATH}"
    }

    stages {
        // etapa para parar los servicios
        stage('Parando los servicios') {
            steps {
               sh  '''
                docker-compose -p sgu-rifr-10 down || true
               '''
            }
        }
        // etapa para eliminar imagenes antiguas
        stage('Eliminando imagenes antiguas') {
            steps {
               sh  '''
                IMAGES=$(docker images --filter "label=com.docker.compose.project=sgu-rifr-10" -q)
                if [ -n "$IMAGES" ]; then
                    docker rmi -f $IMAGES || true
                else 
                    echo "No hay imagenes para eliminar"
                fi
               '''
            }
        }

        // etapa para descargar actualizaciones del repositorio
        stage('Descargando actualizaciones del repositorio') {
            steps {
               checkout scm // que es scm? --> Source Code Management
            }
        }
        // etapa para construir y desplegar
        stage('Construyendo y desplegando') {
            steps {
               sh  '''
                docker-compose up --build -d
               '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline ejecutada con exito'
        }
        failure {
            echo 'Pipeline fallida'
        }
        always {
            echo 'Pipeline finalizada'
        }
    }
}
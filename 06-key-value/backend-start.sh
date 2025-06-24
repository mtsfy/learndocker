source .env.database
source .env.network
source .env.volume

LOCAL_PORT=8000
CONTAINER_PORT=8000

BACKEND_IMAGE_NAME=key-value-backend
BACKEND_IMAGE_TAG=latest

BACKEND_CONTAINER_NAME=backend

if [ "$(docker ps -q -f name=$BACKEND_CONTAINER_NAME)" ]; then 
    echo "\nA container with the name \"$BACKEND_CONTAINER_NAME\" already exists."
    echo "The container will be removed when stopped."
    echo "To stop the container, run: docker kill $BACKEND_CONTAINER_NAME"
    exit 1
fi 

docker build -t $BACKEND_IMAGE_NAME:$BACKEND_IMAGE_TAG \
    -f backend/Dockerfile.dev \
    backend

docker run --rm -d --name $BACKEND_CONTAINER_NAME \
  -e KEY_VALUE_DB=$KEY_VALUE_DB \
  -e KEY_VALUE_USER=$KEY_VALUE_USER \
  -e KEY_VALUE_PASSWORD=$KEY_VALUE_PASSWORD \
  -e PORT=$CONTAINER_PORT \
  -e MONGODB_HOST=$MONGODB_HOST \
  -p $LOCAL_PORT:$CONTAINER_PORT \
  -v ./backend/src:/app/src \
  --network $NETWORK_NAME \
  $BACKEND_IMAGE_NAME:$BACKEND_IMAGE_TAG \

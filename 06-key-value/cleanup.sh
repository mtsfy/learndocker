source .env.database
source .env.network
source .env.volume

if [ "$(docker ps -aq -f name=$DB_CONTAINER_NAME)" ]; then 
    echo "Removing DB container \"$DB_CONTAINER_NAME\""
    docker kill $DB_CONTAINER_NAME
else
    echo "A container with the name \"$DB_CONTAINER_NAME\" doesn't exists. Skipping container deletion."
fi 

if [ "$(docker network ls -q -f name=$NETWORK_NAME)" ]; then
    echo "Removing network \"$NETWORK_NAME\""
    docker network rm $NETWORK_NAME
else
    echo "A network with the name \"$NETWORK_NAME\" doesn't exists. Skipping network deletion."
fi

if [ "$(docker volume ls -q -f name=$VOLUME_NAME)" ]; then
    echo "Removing volume \"$VOLUME_NAME\""
    docker volume rm $VOLUME_NAME
else
    echo "A volume with the name \"$VOLUME_NAME\" doesn't exists. Skipping volume deletion."
fi
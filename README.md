# kaholo-plugin-rabbitmq
RabbitMQ plugin for Kaholo.

## Settings
1. Username (String) **Required** - The username of the default user to authenticate with.
2. Password (Vault) **Required** - The password of the default user to authenticate with.
3. Host (String) **Required** - The URL of the default RabbitMQ server to connect to.
4. Port (String) **Required** - The default port to connect to the RabbitMQ server on.

## Method: Publish Job
Add a new job to the end of the specified queue.

### Parameters
1. Vhost (String) **Required** - The name of the VHost that the queue belongs to.
2. Queue (String) **Required** - The name of the queue to publish the new job into.
3. Message (String) **Optional** - Message to attach to the new job.

## Method: Consume Job
Pop the first item in the queue and get the info about it.

### Parameters
1. Vhost (String) **Required** - The name of the VHost that the queue belongs to.
2. Queue (String) **Required** - The name of the queue to consume the job from.

## Method: Purge Queues
Empty the specified queues.

### Parameters
1. Vhost (String) **Required** - The name of the VHost that the queue belongs to.
2. Queues (String) **Required** - The name of the queuse to empty. Can enter multiple values by seperating them with commas.
const amqp = require('amqplib/callback_api');

function publish(action,settings){
    return new Promise((resolve,reject) => {
        const connectionString = `amqp://${settings.USERNAME}:${settings.PASSWORD}@${settings.HOST}:${settings.PORT}${action.params.vhost ? `/${action.params.vhost}` : ''}`;
        amqp.connect(connectionString,(err, connection)=> {
            if(err){
                return reject(err)
            }

            connection.createConfirmChannel(async (err,channel)=>{
                if (err){
                    return reject(err)
                }
                const queueName = action.params.queue;
                const message = action.params.message;

                channel.assertQueue(queueName,{
                    durable:false   
                })

                channel.sendToQueue(queueName,Buffer.from(message),{},(err)=> {
                    if(err){
                        return reject('Message not sent')
                    }
                    connection.close();
                    return resolve('Message sent')
                })

            })
        })
    })
}

function consume(action,settings){
    return new Promise((resolve,reject) => {
        const connectionString = `amqp://${settings.USERNAME}:${settings.PASSWORD}@${settings.HOST}:${settings.PORT}${action.params.vhost ? `/${action.params.vhost}` : ''}`;
        amqp.connect(connectionString,(err, connection)=> {
            if(err){
                return reject(err)
            }

            connection.createChannel(async (err,channel)=>{
                if (err){
                    return reject(err)
                }
                const queueName = action.params.queue;
                channel.consume(queueName,async (msg)=>{
                    channel.ack(msg);
                    channel.close()
                    setTimeout(()=> {
                        return resolve(msg.content.toString())
                    },1000)
                })
            })
        })
    })
}

function purgeQueues(action,settings){
    return new Promise((resolve,reject) => {
        const connectionString = `amqp://${settings.USERNAME}:${settings.PASSWORD}@${settings.HOST}:${settings.PORT}${action.params.vhost ? `/${action.params.vhost}` : ''}`;
        amqp.connect(connectionString,(err, connection)=> {
            if(err){
                return reject(err)
            }
            connection.createChannel(async (err,channel)=>{
                if (err){
                    throw err;
                }
                let queueName = action.params.queues;
                let queues = queueName.split(',');
                Promise.all(queues.map(queueName => {
                    return purgeQueue(channel,queueName)
                }))
                .then((res) => {
                    return resolve()
                })
                .catch((err) => {
                    return reject()
                })
            })
        })
    })
}

function purgeQueue(channel, queueName){
    return new Promise((resolve,reject) => {
        channel.assertQueue(queueName,{
            durable: false
        });

       return channel.purgeQueue(queueName,(msg) => {
           return resolve()
       })
    })
}


module.exports = {
    publish: publish,
    consume: consume,
    purgeQueues: purgeQueues
}
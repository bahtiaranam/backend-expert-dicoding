const amqp = require('amqplib');

const PlaylistService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(message));
      console.log('Pesan berhasil terkirim!');

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = PlaylistService;

import MessageQueueService from '../libs/message-queue.lib';

export const setupSubscription = async () => {
  //   const msgQueue = await new MessageQueueService();
  const rabbitMQService = new MessageQueueService();
  await rabbitMQService.connect();

  // Create a fanout exchange
  await rabbitMQService.createFanoutExchange();

  rabbitMQService.consumeMessages((msg) => {
    console.log('Received message form the Queue : ', msg);
  });
};

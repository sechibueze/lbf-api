import * as amqp from 'amqplib';

class MessageQueueService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private exchangeName: string = 'pamundo-exchange';

  constructor(private url: string = 'amqp://localhost') {}

  async connect() {
    this.connection = await amqp.connect(this.url);
    this.channel = await this.connection.createChannel();
    console.log('Connected to rabbitMQ successfully ', this.url);
    return this;
  }

  async createFanoutExchange(exchange: string = 'pamundo-exchange') {
    await this.channel.assertExchange(exchange, 'fanout', { durable: true });
    return this;
  }

  async produceMessage(message: string, exchange: string = 'pamundo-exchange') {
    this.channel.publish(exchange, '', Buffer.from(message));
  }

  async consumeMessages(callback: (message: string) => void) {
    const queueName: string = '';
    await this.channel.assertQueue(queueName, { durable: true });
    this.channel.bindQueue(queueName, this.exchangeName, '');
    this.channel.consume(queueName, (msg) => {
      if (msg) {
        callback(msg.content.toString());

        this.channel.ack(msg);
      }
    });
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

export default MessageQueueService;

const handleNewSegment = async (segment) => {
  console.log('New segment added', segment);
  console.log('Updating redis cache...');

  console.log('Updating elastic search ...');
  console.log('Sending notification ...');
};
export const setupSegmentSubscription = async () => {
  try {
    console.log('Setting up segment subscription...');
    const msgQueue = new MessageQueueService();
    await msgQueue.connect();

    await msgQueue.consumeMessages((msg) => handleNewSegment(JSON.parse(msg)));
    console.log('segment subscription completed...');
  } catch (error) {
    throw new Error(error.message);
  }
};

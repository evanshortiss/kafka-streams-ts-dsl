import { Kafka, logLevel } from 'kafkajs';
import faker from 'faker'
import { Debugger } from 'debug';

const kafka = new Kafka({
  brokers: ['localhost:9092'],
  clientId: 'example-streams-client',
  logLevel: logLevel.WARN
});
const consumer = kafka.consumer({ groupId: 'example-consumer-group' });
const producer = kafka.producer();

export default async function start(srcTopic: string, destTopic: string, log: Debugger) {
  log('connecting client producer and consumers')
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: destTopic
  });

  setInterval(async () => {
    const key = faker.random.uuid()
    const value = JSON.stringify({
      name: faker.name.firstName(),
      age: faker.random.number(30)
    })

    const msg = {
      topic: srcTopic,
      messages: [{
        key,
        value
      }]
    }

    log(`sending message key=${key} value=${value}`);
    await producer.send(msg);
  }, 2000);

  await consumer.run({
    eachMessage: async ({ message }) => {
      log(`streams message result is key=${message.key} value=${message.value?.toString()}`);
    }
  });
}

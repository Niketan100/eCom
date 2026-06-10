import fs from 'fs';
import path from 'path';
import { Kafka } from 'kafkajs';

const ca = fs.readFileSync(
  path.join(process.cwd(), 'packages/libs/kafka/ca.pem'),
  'utf-8'
);

export const kafka = new Kafka({
  clientId: 'my-app',
  brokers: [
    'kafka-189c1266-niketankumar12345-6495.h.aivencloud.com:17456'
  ],

  ssl: {
    ca: [ca]
  },

  sasl: {
    mechanism: 'scram-sha-256',
    username: 'avnadmin',
    password: process.env.KAFKA_PASSWORD!
  }
});

const producer = kafka.producer();

async function run() {
  await producer.connect();

  for (let i = 1; i <= 100; i++) {
    const message = `Hello from KafkaJS ${i}`;

    await producer.send({
      topic: 'TOPIC_NAME',
      messages: [
        {
          value: message
        }
      ]
    });

    console.log('Sent:', message);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await producer.disconnect();
}

run().catch(console.error);
import { Consumed } from './consumed.class';
import { Kafka, logLevel } from 'kafkajs';
import { KeyValue } from './key-value-pair.class';
import { Produced } from './produced.class';
import log from './log';
import { FilterOperation, FilterOperationFn, MapOperation, MapOperationFn, StreamOperation } from './operations/operation.class';

export class KStream<K, V> {
  private ops: StreamOperation<any, any, any, any>[] = []

  constructor(
    private topic: string,
    private consumed: Consumed,
    private prev: null | KStream<any, any>
  ) {}

  static from<K extends KeyValue.KeyType, V>(topic: string, consumed: Consumed) {
    return new KStream<K, V>(topic, consumed, null);
  }

  public filter(filter: FilterOperationFn<K, V>): KStream<K,V> {
    this.ops.push(new FilterOperation(filter))
    return this
  }

  public map<KNew extends KeyValue.KeyType, VNew>(
    mapper: MapOperationFn<K, V, KNew, VNew>
  ): KStream<KNew, VNew> {
    this.ops.push(new MapOperation(mapper))
    return this as unknown as KStream<KNew, VNew>
  }

  public async to(topic: string, produced: Produced) {
    // log(`creating KStream from "${topic}" to "${this.topic}"`);

    // const nodes: KStream<any, any>[] = [];

    // const buildNodeList = (current: KStream<any, any>) => {
    //   const n = current.prev;
    //   if (n) {
    //     // Insert previous nodes at the head of the array
    //     nodes.unshift(n);
    //     buildNodeList(n);
    //   }
    // };

    // buildNodeList(this);

    // log(
    //   `built node list with ${
    //     nodes.length
    //   } processors. operations are: ${nodes.map((n) => n.opType).join(', ')}`
    // );

    // const kafka = new Kafka({
    //   brokers: ['localhost:9092'],
    //   clientId: 'app-consumer',
    //   logLevel: logLevel.WARN
    // });
    // const consumer = kafka.consumer({ groupId: 'example-app-group-consumer' });
    // const producer = kafka.producer();

    // await producer.connect();
    // await consumer.connect();

    // log(`consumer subscribing to topic "${this.topic}"`);

    // await consumer.subscribe({
    //   topic: this.topic
    // });
    // await consumer.run({
    //   eachMessage: async ({ message }) => {
    //     log(`processing message at offset: ${message.offset}`);
    //     let payload: KeyValue.KeyValuePair<any, any> | null = null;

    //     for (let idx = 0; idx < nodes.length; idx++) {
    //       const node = nodes[idx];

    //       if (node.opType === undefined) {
    //         throw new Error('KStream opType was undefined');
    //       }
    //       if (node.op === undefined) {
    //         throw new Error('KStream op was undefined');
    //       }
    //       if (message.value === null) {
    //         throw new Error(
    //           'KafkaMessage.value was null. cannot process null messages'
    //         );
    //       }

    //       const dk: any = payload ? payload.getKey() : node.consumed.getKeySerde().deserialize(message.key)
    //       const dv: any = payload ? payload.getValue() : node.consumed.getValueSerde().deserialize(message.value)
    //       let opResult: boolean | KeyValue.KeyValuePair<KeyValue.KeyType, KeyValue.ValueType>;

    //       if (payload === null) {
    //         log(`operation #${idx} ("${node.opType}") on key=${dk} value=%j`,dv);
    //         opResult = node.op(dk, dv);
    //       } else {
    //         log(`operation #${idx} ("${node.opType}") on key=${dk} value=%j`,dv);
    //         opResult = node.op(dk, dv);
    //       }

    //       log(`operation #${idx} ("${node.opType}") result=${opResult}`);

    //       if (typeof opResult === 'boolean') {
    //         if (opResult === false) {
    //           log('payload filtered out');
    //           payload = null;
    //           break;
    //         } else {
    //           log('payload not filtered out');
    //           payload = KeyValue.pair(dk, dv);
    //           continue;
    //         }
    //       } else {
    //         payload = opResult;
    //       }
    //     }

    //     if (payload !== null) {
    //       // Might be null due to being filtered out
    //       log(
    //         `result of operations message: key=${payload?.getKey()} value=%j`,payload?.getValue()
    //       );

    //       const pk = produced.getKeySerde().serialize(payload.getKey());
    //       const pv = produced.getValueSerde().serialize(payload.getValue());

    //       await producer.send({
    //         topic,
    //         messages: [
    //           {
    //             key: pk,
    //             value: pv
    //           }
    //         ]
    //       });
    //     } else {
    //       return Promise.resolve();
    //     }
    //   }
    // });
  }
}

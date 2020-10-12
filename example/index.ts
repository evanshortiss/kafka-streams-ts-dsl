import debug from 'debug'
import {
  StreamsBuilder,
  Produced,
  KeyValue,
  Consumed,
  ConfigProperties,
  Serdes
} from '../src';
import pc from './producer-consumer'

const log = debug('streams-application')
const TOPIC_SRC = 'pre-streams';
const TOPIC_DEST = 'post-streams';

interface DataType {
  age: number;
  name: string;
}

// Create a streams builder instance with Kafka config
const builder = new StreamsBuilder({
  [ConfigProperties.APPLICATION_ID]: 'my-streams-app',
  [ConfigProperties.BOOTSTRAP_SERVERS]: 'localhost:9092'
});

// Build a KStream that filters and maps data to a new topic
builder
  .stream<String, DataType>(
    TOPIC_SRC,
    Consumed.with(Serdes.StringSerde, Serdes.JsonSerde)
  )
  .filter((k, v) => {
    return v.age > 21
  })
  .map((k, v) => {
    return KeyValue.pair(v.name, v.age);
  })
  .to(TOPIC_DEST, Produced.with(Serdes.StringSerde, Serdes.NumberSerde));


pc(TOPIC_SRC, TOPIC_DEST, log)

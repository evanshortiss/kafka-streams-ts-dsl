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
  .stream<string, DataType>(
    TOPIC_SRC,
    Consumed.with(Serdes.Types.String, Serdes.Types.JSON)
  )
  .filter((record) => {
    return record.getValue().age > 21
  })
  .map((record) => {
    return KeyValue.pair(record.getValue().name, record.getValue().age)
  })
  // .filter((k, v) => {
  //   return v.age > 21
  // })
  .to(TOPIC_DEST, Produced.with(Serdes.Types.String, Serdes.Types.Number));


pc(TOPIC_SRC, TOPIC_DEST, log)

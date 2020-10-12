# Kafka Streams DSL in TypeScript

An experiment to build the Kafka Streams Java DSL in TypeScript.

This is an experiment. Don't use this. Seriously.


## Running the Example

See the include [example/](/example) directory for the code.

```
git clone
# Start Kafka and Zookeeper
docker-compose up -d

# Run the example with logging enabled
# DEBUG=streams-application npm run example
```

The output will show that an age filter is applied to each user, and they are
written to a new topic using their name as a key if they pass the filter.

![Example Terminal Output](/images/example.png)

## Sample

This example will create a new stream of values that are filtered by `age`, and
mapped to use `name` as a a key.

```ts
import { StreamsBuilder, Produced, KeyValue, Consumed, ConfigProperties, Serdes } from '../src';

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
// The JsonSerde will automatically run JSON.parse on data
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
```

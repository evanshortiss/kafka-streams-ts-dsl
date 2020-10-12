# Kafka Streams DSL in TypeScript

An experiment to build the Kafka Streams Java DSL in TypeScript.

This is an experiment. Don't use this. Seriously.


## Running the Example

```
# Start Kafka and Zookeeper
docker-compose up -d

# Run the example with logging enabled
# DEBUG=streams-application npm run example
```

The output will show that an age filter is applied to each user, and they are
written to a new topic using their name as a key if they pass the filter.

![Example Terminal Output](/images/example.png)

import { Config } from "./config";
import { Consumed } from "./consumed.class";
import { KStream } from "./kstream.class";

export class StreamsBuilder {

  constructor (private config: Config) {}

  public stream <K, V> (topic: string, consumed: Consumed): KStream<K, V> {
    return KStream.from<K, V>(topic, consumed)
  }
}

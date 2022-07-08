import { Config } from "./config";
import { Consumed } from "./consumed.class";
import { KStream } from "./kstream.class";
import { StreamsNode } from "./node";

export class StreamsBuilder {
  private nodes: StreamsNode[] = []

  constructor (private config: Config) {}

  public stream <K, V> (topic: string, consumed: Consumed<K, V>) {
    const s = KStream.from<K, V>(topic, consumed)
    this.nodes.push(s)
    return s
  }

  public build (): void {
    this.nodes.forEach(n => {

    })
  }
}

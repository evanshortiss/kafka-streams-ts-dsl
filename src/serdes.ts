export namespace Serdes {
  export abstract class Serde<T> {
    constructor() {}
    abstract serialize(data: T): Buffer;
    abstract deserialize(data: Buffer): T;
  }

  export type ValidSerdes =
    | typeof StringSerde
    | typeof NumberSerde
    | typeof BufferSerde
    | typeof JsonSerde;

  export class StringSerde extends Serde<string> {
    serialize(data: string) {
      return Buffer.from(data);
    }

    deserialize(data: Buffer) {
      return data.toString();
    }
  }

  export class NumberSerde extends Serde<number> {
    serialize(data: number) {
      return Buffer.from(data.toString());
    }

    deserialize(data: Buffer) {
      if (data.includes('.')) {
        return parseFloat(data.toString());
      } else {
        return parseInt(data.toString(), 10);
      }
    }
  }

  export class BufferSerde extends Serde<Buffer> {
    serialize(data: Buffer) {
      return data;
    }

    deserialize(data: Buffer) {
      return data;
    }
  }

  export class JsonSerde<T> extends Serde<Record<string, T>|T[]> {
    serialize(data: Record<string, T>|T[]) {
      return Buffer.from(JSON.stringify(data));
    }

    deserialize(data: Buffer) {
      return JSON.parse(data.toString());
    }
  }
}

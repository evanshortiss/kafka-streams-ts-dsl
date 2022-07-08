export function String () {
  return new StringSerde()
}

export function Number () {
  return new NumberSerde()
}

export function Json<T> () {
  return new JsonSerde<T>()
}

export function Bytes () {
  return new BytesSerde()
}

export class SerdeError extends Error {
  constructor (msg: string) {
    super(msg)
  }
}

export abstract class AbstractSerde<T = unknown> {
  constructor() {}
  abstract serialize(data: T): Buffer;
  abstract deserialize(data: Buffer): T;
}

class StringSerde extends AbstractSerde<string> {
  serialize(data: string) {
    return Buffer.from(data);
  }

  deserialize(data: Buffer) {
    return data.toString();
  }
}

class NumberSerde extends AbstractSerde<number> {
  serialize(data: number) {
    return Buffer.from(data.toString());
  }

  deserialize(data: Buffer) {
    let value: number

    if (data.includes('.')) {
      value = parseFloat(data.toString());
    } else {
      value = parseInt(data.toString(), 10);
    }

    if (isNaN(value)) {
      throw new SerdeError(`NumberSerde failed to parse input to a number. Input buffer was: ${data.toString()}`)
    }

    return value
  }
}

class BytesSerde extends AbstractSerde<Buffer> {
  serialize(data: Buffer) {
    return data;
  }

  deserialize(data: Buffer) {
    return data;
  }
}

class JsonSerde<DataType> extends AbstractSerde<DataType> {
  serialize(data: DataType) {
    return Buffer.from(JSON.stringify(data));
  }

  deserialize(data: Buffer): DataType {
    try {
      return JSON.parse(data.toString());
    } catch (e) {
      throw new SerdeError(`JsonSerde failed to parse data in Buffer: "${data.toString()}"`)
    }
  }
}


export namespace KeyValue {
  export type KeyType = string | number | Buffer | Record<string, any>

  export function pair <K extends KeyType, V>(key: K, value: V) {
    return new KeyValuePair<K, V>(key, value);
  }

  export class KeyValuePair<K extends KeyType, V> {
    constructor(private key: K, private value: V) {}

    getKey() {
      return this.key;
    }

    getValue() {
      return this.value;
    }
  }
}

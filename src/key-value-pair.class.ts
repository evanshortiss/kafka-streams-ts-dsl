export class KeyValue {
  constructor() {}

  static pair<K, V>(key: K, value: V) {
    return new KeyValuePair<K, V>(key, value);
  }
}

export class KeyValuePair<K, V> {
  constructor(private key: K, private value: V) {}

  getKey() {
    return this.key;
  }

  getValue() {
    return this.value;
  }
}


import { KeyValue } from "../key-value-pair.class";

export type StreamOperationFn <K extends KeyValue.KeyType, V, T> = (record: KeyValue.KeyValuePair<K, V>) => T
export class StreamOperation <K extends KeyValue.KeyType, V, T, F extends StreamOperationFn<K, V, T>> {
  constructor (private name: string, private fn: F) {}

  exec (record: KeyValue.KeyValuePair<K, V>) {
    return this.fn(record)
  }
}

export type MapOperationFn<K extends KeyValue.KeyType, V, KNew extends KeyValue.KeyType, VNew> = (record: KeyValue.KeyValuePair<K, V>) => KeyValue.KeyValuePair<KNew, VNew>;
export class MapOperation<K extends KeyValue.KeyType, V, KNew extends KeyValue.KeyType, VNew> extends StreamOperation <K, V, KeyValue.KeyValuePair<KNew, VNew>, MapOperationFn<K, V, KNew, VNew>> {
  constructor (fn: MapOperationFn<K, V, KNew, VNew>) {
    super('map', fn)
  }
}

export type FilterOperationFn<K extends KeyValue.KeyType, V> = (record: KeyValue.KeyValuePair<K, V>) => boolean;
export class FilterOperation <K extends KeyValue.KeyType, V> extends StreamOperation <K, V, boolean, FilterOperationFn<K, V>> {
  constructor (fn: FilterOperationFn<K, V>) {
    super('filter', fn)
  }
}

export abstract class MessageProcessor<K, V> {
  constructor (protected name: string, protected context: boolean, protected predicate: Function) {}

  abstract process (key: K, value: V): void
}

export class KStreamFilter<K, V> implements MessageProcessor<K, V> {
  constructor (
    name: string,
    context: boolean,
    predicate: (k: K, v: V) => boolean
  ) {}

  process (key: K, value: V): boolean {
    return this.predicate(key, value)
  }
}

export class KStreamMapper<K, V, KNew, VNew> implements MessageProcessor<K, V> {
  constructor (private mapFn: (k: K, v: V) => KeyValue.KeyValuePair<KNew, VNew>) {
    super('map')
  }

  process (key: K, value: V) {
    return this.mapFn(key, value)
  }
}

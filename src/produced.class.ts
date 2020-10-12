import { Serdes } from './serdes';

export class Produced {
  private ks: Serdes.Serde<unknown>;
  private vs: Serdes.Serde<unknown>;

  private constructor(
    protected keySerdeClass: Serdes.ValidSerdes,
    protected valueSerdeClass: Serdes.ValidSerdes
  ) {
    this.ks = new keySerdeClass();
    this.vs = new valueSerdeClass();
  }

  public static with(
    keySerde: Serdes.ValidSerdes,
    valueSerde: Serdes.ValidSerdes
  ) {
    return new Produced(keySerde, valueSerde);
  }

  getKeySerde() {
    return this.ks;
  }

  getValueSerde() {
    return this.vs;
  }
}

import { AbstractSerde } from "./serdes";

export class Consumed <K, V> {
  private ksInstance: AbstractSerde
  private vsInstance: AbstractSerde

  private constructor (protected ks: AbstractSerde<K>, protected vs: AbstractSerde<V>) {
    this.ksInstance = ks
    this.vsInstance = vs
  }

  public static with<
    KD extends AbstractSerde,
    KT extends ReturnType<KD['deserialize']>,
    VD extends AbstractSerde,
    VT extends ReturnType<VD['deserialize']>
  > (ks: AbstractSerde, vs: VT) {
    return new Consumed<KT, VT>(ks as AbstractSerde<KT>, vs as AbstractSerde<VT>)
  }

  getKeySerde () {
    return this.ksInstance
  }

  getValueSerde () {
    return this.vsInstance
  }
}

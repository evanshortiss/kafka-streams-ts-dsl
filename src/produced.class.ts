import { BufferSerde, JsonSerde, NumberSerde, SerdeBase, Serdes, StringSerde } from "./serdes";

// export type TypeName = Types.String|Types.Buffer|Types.JSON|Types.Buffer

export class Produced {
  private ksInstance: Serde
  private vsInstance: Serde

  private constructor (protected ks: Serdes.Types, protected vs: Serdes.Types) {
    this.ksInstance = this.createSerde(ks)
    this.vsInstance = this.createSerde(vs)
  }

  private createSerde (st: Serdes.Types) {
    if (st === Serdes.Types.Buffer) {
      return new BufferSerde()
    } else if (st === Serdes.Types.JSON) {
      return new JsonSerde()
    } else if (st === Serdes.Types.String) {
      return new StringSerde()
    } else if (st === Serdes.Types.Number) {
      return new NumberSerde()
    } else {
      throw new Error(`Invalid Serde type "${st}" passed to Produced`)
    }
  }

  public static with <KS extends Serdes.Types, VS extends Serdes.Types> (ks: KS, vs: VS) {
    return new Produced(ks, vs)
  }

  getKeySerde () {
    return this.ksInstance
  }

  getValueSerde () {
    return this.vsInstance
  }
}

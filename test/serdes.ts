import test from 'tape';
import * as Serdes from '../src/serdes'

test('NumberSerde: serialize', (t) => {
  const s = Serdes.Number()

  const serializedData = s.serialize(123)

  t.equal(
    Buffer.compare(serializedData, Buffer.from('123')),
    0,
    'should produce a buffer containing string value "123"'
  );
  t.end()
})

test('NumberSerde: deserialize', (t) => {
  const s = Serdes.Number()
  const deserializedData = s.deserialize(Buffer.from('123'))
  t.equal(
    deserializedData,
    123,
    'should be deserialised into number type with value 123'
  );
  t.end()
})

test('JsonSerde: serialize', (t) => {
  type JsonType = {
    name:  string
  }
  const s = Serdes.Json<JsonType>()
  const data = { name: 'kafka' }
  const serializedData = s.serialize(data)

  t.equal(
    Buffer.compare(serializedData, Buffer.from(JSON.stringify(data))),
    0,
    'should create a Buffer containing the JSON as given'
  );
  t.end()
})

test('JsonSerde: deserialize', (t) => {
  type JsonType = {
    name:  string
  }

  const serde = Serdes.Json<JsonType>()
  const data = { name: 'kafka' }
  const deserialized = serde.deserialize(Buffer.from(JSON.stringify(data)))

  t.deepEqual(
    deserialized,
    data
  )
  t.equal(
    deserialized.name,
    data.name,
    'should use generic to provide intellisense'
  )

  t.end()
})

test('Custom Serde by extending AbstractSerde', (t) => {
  class BoolSerde extends Serdes.AbstractSerde<boolean> {
    serialize (input: boolean) {
      return input ? Buffer.from('1') : Buffer.from('0')
    }

    deserialize (input: Buffer) {
      const value = input.toString()

      if (value !== '1' && value !== '0') {
        throw new Serdes.SerdeError(`BoolSerde.deserialize expects either "1" or "0" as input. Received "${value}"`)
      }

      return input.toString() === '1' ? true : false
    }
  }

  const serde = new BoolSerde();

  t.equal(Buffer.compare(Buffer.from('1'), serde.serialize(true)), 0)
  t.equal(Buffer.compare(Buffer.from('0'), serde.serialize(false)), 0)

  t.equal(serde.deserialize(Buffer.from('0')), false)
  t.equal(serde.deserialize(Buffer.from('1')), true)

  t.end();
});

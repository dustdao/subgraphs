import { Address, BigInt } from '@graphprotocol/graph-ts'
import { assert, clearStore, test } from 'matchstick-as'
import { CreateStream as CreateStreamEvent } from '../generated/FuroStream/FuroStream'
import { onCreateStream } from '../src/mappings/stream'
import { createStreamEvent, createTokenMock } from './mocks'

const WETH_ADDRESS = Address.fromString('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
const SENDER = Address.fromString('0x00000000000000000000000000000000000a71ce')
const RECIEVER = Address.fromString('0x0000000000000000000000000000000000000b0b')
const STREAM_ID = BigInt.fromString('1001')
const AMOUNT = BigInt.fromString('1000000')
const START_TIME = BigInt.fromString('1648297495') // 	Sat Mar 26 2022 12:24:55 GMT+0000
const END_TIME = BigInt.fromString('1650972295') // 	Tue Apr 26 2022 11:24:55 GMT+0000, One month later
let streamEvent: CreateStreamEvent

function setup(): void {
  streamEvent = createStreamEvent(STREAM_ID, SENDER, RECIEVER, WETH_ADDRESS, AMOUNT, START_TIME, END_TIME, true)
  createTokenMock(WETH_ADDRESS.toHex(), BigInt.fromString('18'), 'Wrapped Ether', 'WETH')
  onCreateStream(streamEvent)
}

function cleanup(): void {
  clearStore()
}

test('users are created on stream creation event', () => {
  setup()

  assert.entityCount('User', 2)
  assert.fieldEquals('User', SENDER.toHex(), 'id', SENDER.toHex())
  assert.fieldEquals('User', SENDER.toHex(), 'createdAtBlock', streamEvent.block.number.toString())
  assert.fieldEquals('User', SENDER.toHex(), 'createdAtTimestamp', streamEvent.block.timestamp.toString())
  assert.fieldEquals('User', RECIEVER.toHex(), 'id', RECIEVER.toHex())
  assert.fieldEquals('User', SENDER.toHex(), 'createdAtBlock', streamEvent.block.number.toString())
  assert.fieldEquals('User', SENDER.toHex(), 'createdAtTimestamp', streamEvent.block.timestamp.toString())

  cleanup()
})

import {
  Ended as AuctionEndedEvent,
  PlacedBid as BidEvent,
  Started as AuctionCreatedEvent,
} from '../../generated/AuctionMaker/AuctionMaker'
import { createAuction, endAuction, updateAuction } from './functions/auction'
import { createBid, createInitialBid } from './functions/bid'
import { getOrCreateUser } from './functions/user'

export function onAuctionCreated(event: AuctionCreatedEvent): void {
  getOrCreateUser(event.params.bidder.toHex(), event)
  const auction = createAuction(event)
  createInitialBid(auction, event)
}

export function onBid(event: BidEvent): void {
  getOrCreateUser(event.params.bidder.toHex(), event)
  const auction = updateAuction(event)
  createBid(auction, event)
}

export function onAuctionEnded(event: AuctionEndedEvent): void {
  getOrCreateUser(event.params.bidder.toHex(), event)
  endAuction(event)
}

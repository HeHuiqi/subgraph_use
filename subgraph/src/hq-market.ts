import {
  Approval as HqMarketApprovalEvent,
  Transfer as HqMarketTransferEvent
} from "../generated/HqMarket/HqMarket"
import { HqMarketApproval, HqMarketTransfer } from "../generated/schema"

export function handleHqMarketApproval(event: HqMarketApprovalEvent): void {
  let entity = new HqMarketApproval(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value
  entity.save()
}

export function handleHqMarketTransfer(event: HqMarketTransferEvent): void {
  let entity = new HqMarketTransfer(
    event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value
  entity.save()
}

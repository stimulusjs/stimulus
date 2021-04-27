import { Controller } from "../../controller"

export type ActionLogEntry = {
  name: string
  controller: Controller
  identifier: string
  eventType: string
  currentTarget: EventTarget | null
  defaultPrevented: boolean
  passive: boolean
}

export type MutationLogEntry = {
  attributeName: string | null,
  controller: Controller
  name: string,
  oldValue: string | null,
  type: string,
}

export class LogController extends Controller {
  static actionLog: ActionLogEntry[] = []
  static mutationLog: MutationLogEntry[] = []
  initializeCount = 0
  connectCount = 0
  disconnectCount = 0

  initialize() {
    this.initializeCount++
  }

  connect() {
    this.connectCount++
  }

  disconnect() {
    this.disconnectCount++
  }

  log(event: Event) {
    this.recordAction("log", event)
  }

  log2(event: Event) {
    this.recordAction("log2", event)
  }

  log3(event: Event) {
    this.recordAction("log3", event)
  }

  logMutation(mutation: MutationRecord) {
    this.recordMutation("logMutation", mutation)
  }

  logMutation2(mutation: MutationRecord) {
    this.recordMutation("logMutation2", mutation)
  }

  logPassive(event: Event) {
    event.preventDefault()
    if (event.defaultPrevented) {
      this.recordAction("logPassive", event, false)
    } else {
      this.recordAction("logPassive", event, true)
    }
  }

  stop(event: Event) {
    this.recordAction("stop", event)
    event.stopImmediatePropagation()
  }

  get actionLog() {
    return (this.constructor as typeof LogController).actionLog
  }

  private recordAction(name: string, event: Event, passive?: boolean) {
    this.actionLog.push({
      name,
      controller: this,
      identifier: this.identifier,
      eventType: event.type,
      currentTarget: event.currentTarget,
      defaultPrevented: event.defaultPrevented,
      passive: passive || false
    })
  }

  get mutationLog() {
    return (this.constructor as typeof LogController).mutationLog
  }

  private recordMutation(name: string, mutation: MutationRecord) {
    const { attributeName, oldValue, type } = mutation
    this.mutationLog.push({
      attributeName,
      controller: this,
      name,
      oldValue,
      type
    })
  }
}

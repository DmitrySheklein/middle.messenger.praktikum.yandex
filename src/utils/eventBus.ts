type TEvent = string
type TCallback = (...arg: any[]) => void

interface EventEmitter {
    on(event: TEvent, callback: TCallback): void
    off(event: TEvent, callback: TCallback): void
    emit(event: TEvent, ...args: any[]): void
}

export default class EventBus implements EventEmitter {
    listeners: { [key: string]: TCallback[] }

    constructor() {
        this.listeners = {}
    }

    on(event: TEvent, callback: TCallback): void {
        if (!this.listeners[event]) {
            this.listeners[event] = []
        }

        this.listeners[event].push(callback)
    }

    off(event: TEvent, callback: TCallback): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`)
        }

        this.listeners[event] = this.listeners[event].filter(
            (listener) => listener !== callback
        )
    }

    emit(event: TEvent, ...args: any[]): void {
        if (!this.listeners[event]) {
            throw new Error(`Нет события: ${event}`)
        }

        this.listeners[event].forEach((listener) => listener(...args))
    }
}

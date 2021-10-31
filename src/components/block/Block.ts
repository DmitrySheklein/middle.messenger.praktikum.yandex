import { v4 as makeUUID } from "uuid"
import EventBus from "../../utils/eventBus"
import parseDOMFromString from "../../utils/parseDOMFromString"

enum EVENTS {
    INIT = "init",
    FLOW_CDM = "flow:component-did-mount",
    FLOW_CDU = "flow:component-did-update",
    FLOW_RENDER = "flow:render"
}
export type Props = {
    classNames?: string[]
    events?: { [key: string]: (e: Event, ...args: any[]) => void }
    [key: string]: unknown
}
export type Settings = {
    withInternalID?: boolean
}
export default abstract class Block {
    private _element: HTMLElement

    private _container: HTMLElement

    private _meta: { props?: Props } & Settings

    private readonly _id: string

    private eventBus: () => EventBus

    props: Props

    constructor(props: Props = {}, settings: Settings = {}) {
        this._meta = {
            props,
            withInternalID: settings.withInternalID
        }
        if (this._meta.withInternalID) {
            this._id = makeUUID()
        }

        this.props = this._makePropsProxy({ ...props })
        const eventBus = new EventBus()
        this.eventBus = () => eventBus
        this._registerEvents(eventBus)
        eventBus.emit(EVENTS.INIT)
    }

    private _registerEvents(eventBus: EventBus) {
        eventBus.on(EVENTS.INIT, this.init.bind(this))
        eventBus.on(EVENTS.FLOW_CDM, this._componentDidMount.bind(this))
        eventBus.on(EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this))
        eventBus.on(EVENTS.FLOW_RENDER, this._render.bind(this))
    }

    private _createResources() {
        this._container = document.createElement("div")
        if (this._meta.props?.classNames) {
            this._meta.props.classNames.forEach((className: string) => {
                this._container.classList.add(className)
            })
        }
    }

    private init() {
        this._createResources()
        this.eventBus().emit(EVENTS.FLOW_CDM)
    }

    private _componentDidMount() {
        this.componentDidMount()
        this.eventBus().emit(EVENTS.FLOW_RENDER)
    }

    componentDidMount(oldProps?: Props): void {
        console.log(oldProps)
    }

    private _componentDidUpdate(oldProps: Props, newProps: Props): void {
        const response = this.componentDidUpdate(oldProps, newProps)
        if (!response) {
            return
        }

        this._render()
    }

    componentDidUpdate(oldProps: Props, newProps: Props): boolean {
        console.log(oldProps, newProps)
        return true
    }

    setProps = (nextProps: Props): void => {
        if (!nextProps) {
            return
        }

        Object.assign(this.props, nextProps)
    }

    get element() {
        return this._element
    }

    _render(): void {
        const block = this.render()

        if (typeof block === "string") {
            const HTMLElement = parseDOMFromString(block)
            if (this._meta.withInternalID) {
                HTMLElement.setAttribute("data-id", this._id)
            }

            this._removeEvents()
            this._element = HTMLElement
            this._addEvents()
        } else {
            this._removeEvents()
            this._element = block
            this._addEvents()
        }

        this._container.innerHTML = ""
        this._container.appendChild(this._element)
    }

    _addEvents(): void {
        if (this._element) {
            const { events = {} } = this.props

            Object.keys(events).forEach((eventName) => {
                this._element.addEventListener(eventName, events[eventName])
            })
        }
    }

    _removeEvents(): void {
        if (this._element) {
            const { events = {} } = this.props

            Object.keys(events).forEach((eventName) => {
                this._element.removeEventListener(eventName, events[eventName])
            })
        }
    }
    // Может переопределять пользователь, необязательно трогать
    abstract render(): string | HTMLElement

    getContent() {
        return this._container
    }

    _makePropsProxy(props: Props): Props {
        return new Proxy(props, {
            get: (target, prop: string) => {
                const value = target[prop]

                return typeof value === "function" ? value.bind(target) : value
            },
            set: (target, prop: string, value) => {
                target[prop] = value
                this.eventBus().emit(
                    EVENTS.FLOW_CDU,
                    { ...target },
                    { ...target, [prop]: value }
                )
                return true
            },
            deleteProperty: () => {
                throw new Error("Нет доступа")
            }
        })
    }

    show(): void {
        this.getContent().style.display = "block"
    }

    hide(): void {
        this.getContent().style.display = "none"
    }
}

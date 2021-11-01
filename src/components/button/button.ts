import Block, { Props } from "../block/Block"

type ButtonProps = {
    title: string
    type?: string
} & Props

export default class Button extends Block {
    constructor(props: ButtonProps) {
        super(props, { withInternalID: true })
    }

    render(): string {
        const { title, type } = this.props
        return getTemplate({ title, type })
    }
}

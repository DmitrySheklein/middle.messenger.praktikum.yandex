const parser = new DOMParser()

export default (pugRenderResult: string): HTMLElement => {
    const { body } = parser.parseFromString(pugRenderResult, "text/html")
    const element = body.firstElementChild ? body.firstElementChild : body
    return element as HTMLElement
}

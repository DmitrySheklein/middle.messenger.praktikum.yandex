enum METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}

type IOption = {
    timeout?: number
    data?: { [key: string]: string } | any
    method?: METHODS
    headers?: { [key: string]: string }
    withCredentials?: boolean
}

function queryStringify(data: { [key: string]: string | number }) {
    if (data === undefined || typeof data !== "object") {
        throw new Error("Data must be object")
    }

    const keys = Object.keys(data)
    return keys.reduce((result, key, index) => {
        return `${result}${key}=${data[key]}${
            index < keys.length - 1 ? "&" : ""
        }`
    }, "?")
}

export default class HTTPTransport {
    get = (url: string, options: IOption = {}): Promise<XMLHttpRequest> => {
        return this.request(
            url,
            { ...options, method: METHODS.GET },
            options.timeout
        )
    }

    post = (url: string, options: IOption = {}): Promise<XMLHttpRequest> => {
        return this.request(
            url,
            { ...options, method: METHODS.POST },
            options.timeout
        )
    }

    put = (url: string, options: IOption = {}): Promise<XMLHttpRequest> => {
        return this.request(
            url,
            { ...options, method: METHODS.PUT },
            options.timeout
        )
    }

    delete = (url: string, options: IOption = {}): Promise<XMLHttpRequest> => {
        return this.request(
            url,
            { ...options, method: METHODS.DELETE },
            options.timeout
        )
    }

    // eslint-disable-next-line class-methods-use-this
    request = (
        url: string,
        options: IOption = {},
        timeout = 5000
    ): Promise<XMLHttpRequest> => {
        const { headers = {}, method = METHODS.GET, data } = options

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()
            const isGet = method === METHODS.GET

            xhr.open(
                method,
                isGet && !!data ? `${url}${queryStringify(data)}` : url
            )

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key])
            })

            xhr.onload = () => {
                resolve(xhr)
            }

            xhr.onabort = reject
            xhr.onerror = reject

            xhr.timeout = timeout
            xhr.ontimeout = reject

            if (isGet || !data) {
                xhr.send()
            } else {
                xhr.send(data)
            }
        })
    }
}

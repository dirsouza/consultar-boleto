import { isString, isObject } from '@/utils'

export class HttpException extends Error {
  constructor (
    private readonly response: string | Record<string, any>,
    private readonly status: number
  ) {
    super()
    this.initMessage()
    this.initName()
  }

  public initMessage (): void {
    if (isString(this.response)) {
      this.message = this.response
    } else if (
      isObject(this.response) &&
      isString((this.response as Record<string, any>).message)
    ) {
      this.message = (this.response as Record<string, any>).message
    }
  }

  public initName (): void {
    this.name = this.constructor.name
  }

  public getResponse (): string | object {
    return this.response
  }

  public getStatus (): number {
    return this.status
  }

  public static createBody (
    objectOrError: object | string,
    description?: string,
    statusCode?: number
  ): Object {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!objectOrError) {
      return { statusCode, message: description }
    }

    return isObject(objectOrError) && !Array.isArray(objectOrError)
      ? objectOrError
      : { statusCode, message: objectOrError, error: description }
  }
}

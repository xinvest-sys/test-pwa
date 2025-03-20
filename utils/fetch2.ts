export namespace Fetch {
  export type Method = 
    | 'GET' 
    | 'POST' 
    | 'PUT' 
    | 'DELETE'
  ;

  export type Extra<T> = {
    body?: T | null, 
    token?: string | null
  }
}

export class Fetch<T> {
  private _url: string = '';
  private _body: T | null = null;       /// Extra field
  private _token: string | null = null; /// Extra field

  private _hasBody: boolean = false;    /// True if has body set
  private _secure: boolean = false;     /// True if has token set

  setUrl (url: string) {
    this._url = url;
    return this;
  }

  setToken(token: string) {
    this._token = token;
    this._secure = this._token !== null || this._token !== '';
    return this;
  }

  setBody(body: T) {
    this._body = body;
    this._hasBody = this._body !== null;
    return this;
  }

  async GET(): Promise<T> {
    this.guard();
    const extra: Fetch.Extra<T> = this.getExtra();
    const response =  await this.send(this._url, 'GET', extra);
    const json: T = await response.json();
    return json;
  }

  async POST(): Promise<Response> {
    this.guard();
    const extra: Fetch.Extra<T> = this.getExtra();
    return await this.send(this._url, 'POST', extra);
  }

  async PUT(): Promise<Response> {
    this.guard();
    const extra: Fetch.Extra<T> = this.getExtra();
    return await this.send(this._url, 'PUT', extra);
  }

  async DELETE(): Promise<Response> {
    this.guard();
    const extra: Fetch.Extra<T> = this.getExtra();
    return await this.send(this._url, 'DELETE', extra);
  }

  private guard() {
    if (!this._url || this._url === '') throw new Error('Url is required');
  }

  private getExtra() {
    let extra: Fetch.Extra<T> = {};
    if (this._hasBody) Object.assign(extra, { body: this._body });
    if (this._secure)  Object.assign(extra, { token: this._token });
    return extra;
  }

  private async send(url: string, method: Fetch.Method, extra: Fetch.Extra<T>): Promise<Response> {
    try {
      const { body, token } = extra;
      const options: RequestInit = { 
        method,
        // mode: 'cors' as RequestMode, 
      };
      let headers: HeadersInit = {};

      if (body) {
        headers = { ...headers, 'Content-Type': 'application/json' };
        Object.assign(options, { body: JSON.stringify(body) });
      }

      /// without credentials -> cookie didn't have token on server side.
      /// with credentials -> cookie have token but cors failed.
      // if (token && token !== '') {
      //   headers = { ...headers, 'Cookie': `__Secure-next-auth.session-token=${token}` };
      //   Object.assign(options, { credentials: 'include' as RequestCredentials });
      // }

      Object.assign(options, { headers: headers });
      console.log(options);

      const response = await fetch(url, options);
      if (!response.ok) {
        const error = await response.json();
        if (error) {
          throw new Error(error.message);
        } else {
          const statusText = `Status: ${response.status.toString()}/${response.statusText}`;
          throw new Error(statusText);
        }
      }
      return response;
    } catch (error) {
      console.log(`Fetch error: ${error}`);
      throw error;
    }
  }
}
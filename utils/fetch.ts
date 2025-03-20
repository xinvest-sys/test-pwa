type httpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function get<T>(url: string): Promise<T> {
  const response = await fetchUrl(url, "GET");
  const json: T = await response.json();
  return json;
}

export async function post<T>(url: string, body: T) {
  return fetchUrl(url, "POST", body);
}

export async function put<T>(url: string, body: T) {
  return fetchUrl(url, "PUT", body);
}

export async function del(url: string) {
  return fetchUrl(url, "DELETE");
}

async function fetchUrl(url: string, method: httpMethod = 'POST', body?: any): Promise<Response> {
  try {
    let response;
    if (method === 'PUT' || method === 'POST') {
      const option = {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };
      
      response = await fetch(url, option);
    } else if (method === 'DELETE') {
      response = await fetch(url, { method: method });
    } else {
      response = await fetch(url);
    }

    if (!response.ok) {
      const error = await response.json();

      if (error) {
        throw new Error(error.message);
      } else {
        const statusText = `Status: ${response.status.toString()} -- ${
          response.statusText
        }`;
        throw new Error(statusText);
      }
    }
    return response;
  } catch (error) {
    console.log(`Error fetch() GET - error: ${error}`);
    throw new Error(error as string);
  }
}


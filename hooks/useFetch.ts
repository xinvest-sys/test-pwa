/**
 * Defibne generic GET, POST methods of fetch()
 * useGet retuern: status, responseData as data, error, isLoading
*/

import { useState, useEffect } from "react";

export type TFetchResponse = {
  status: string | null
  hasError: boolean
  data?: any // return fetch data or error
};

export type TFetchRequest = {
  endpoint: string
  method: 'GET' | 'PUT' | 'POST' | 'DELETE'
  body?: object
};

export async function useGet (endpoint: string) {
  try {
    const apiResponse = await fetch(endpoint);
    const statusText = `Status: ${apiResponse.status.toString()} -- ${apiResponse.statusText}`;

    if (!apiResponse.ok) {
      throw new Error(statusText);
    }
    
    const json = await apiResponse.json();
    return json;
  } catch (error) {
    console.log(`Error fetch() GET - error: ${error}`);
  } 
};

// export const useFetch = (props: TFetchRequest | null) => {
export const useFetch = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [fetchRequest, setFetchRequest] = useState<TFetchRequest | null>(null);
  const [fetchResponse, setFetchResponse] = useState({} as TFetchResponse);

  const fetchApi = async () => {
    if (fetchRequest) {
    try {
      const url = fetchRequest.endpoint;
      setIsLoading(true);
      console.log(
        `Start fetchApi - endpoint: ${url}, isLoading: ${isLoading}`
      );
      let apiResponse;
      if (fetchRequest.method == 'GET') {
        apiResponse = await fetch(url);
      } else {
        const option = {
          method: fetchRequest.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fetchRequest.body),
        };
        apiResponse = await fetch(url, option);
      };

      const statusText = `Status: ${apiResponse.status.toString()} -- ${apiResponse.statusText}`;

      if (!apiResponse.ok) {
        throw new Error(statusText);
      }
      const json = await apiResponse.json();

      setFetchResponse({
        hasError: false,
        status: `Status: ${apiResponse.status.toString()} -- ${
          apiResponse.statusText
        }`,
        data: json,
      });
      console.log(`Return fetchApi() - status: ${statusText}, url: ${url}`);
    } catch (error: any) {
      setFetchResponse({
        hasError: true,
        status: error.toString(),
      });
      console.log(`Error fetchApi() - error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }};

  useEffect(() => {
    // if (props) {
    //   setFetchRequest(props);
    // }
    fetchApi();
  }, []);

  return { fetchResponse, isLoading, setFetchRequest };
};
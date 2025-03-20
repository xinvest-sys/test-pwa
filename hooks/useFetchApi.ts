
import { useState, useEffect } from 'react';

export type TApiResponse = {
  fetchApi: Function
  status: Number
  statusText: String
  data: any
  error: any
  isLoading: Boolean
};

export const useApiGet = (url: string): TApiResponse => {

  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>("");
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(`Before fetch() GET - isLoading:, ${isLoading}  status: ${status}`);

  const fetchApi = async (url: string) => {
    setIsLoading(true);

    try {
      const apiResponse = await fetch(url);
      const json = await apiResponse.json();
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(json);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  useEffect( () => {
    fetchApi(url);
  }, []);

  console.log('Before return fetch() PUT - status:', status, 'data:', data, error!==undefined?`err: ${error}`:'' );

  return { fetchApi, status, statusText, data, error, isLoading };
};


export const useApiPut = (): TApiResponse => {

  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>("");
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(`Before fetch() PUT - isLoading:, ${isLoading}  status: ${status}`);

  const fetchApi = async (url: string, body: {}) => {
    setIsLoading(true);

    const option = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    };

    try {
      const apiResponse = await fetch(url, option);
      const json = await apiResponse.json();
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(json);
    } catch (error) {
      setError(error);
    }
    // console.log(`After fetch() PUT - isLoading:, ${isLoading}  err: ${error}`);

    setIsLoading(false);
  };

  console.log('Before return fetch() PUT - status:', status, 'data:', data, error!==undefined?`err: ${error}`:'' );

  return {fetchApi, status, statusText, data, error, isLoading };
};



export const useApiPost = (): TApiResponse => {

  const [status, setStatus] = useState<Number>(0);
  const [statusText, setStatusText] = useState<String>("");
  const [data, setData] = useState<any>();
  const [error, setError] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log(`Before fetch() POST - isLoading:, ${isLoading}  status: ${status}`);

  const fetchApi = async (url: string, body: {}) => {
    setIsLoading(true);

    const option = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body === undefined ? {} : body)
    };

    try {
      const apiResponse = await fetch(url, option);
      const json = await apiResponse.json();
      setStatus(apiResponse.status);
      setStatusText(apiResponse.statusText);
      setData(json);
    } catch (error) {
      setError(error);
    }
    // console.log(`After fetch() PUT - isLoading:, ${isLoading}  err: ${error}`);

    setIsLoading(false);
  };

  console.log('Before return fetch() POST - status:', status, 'data:', data, error!==undefined?`err: ${error}`:'' );

  return {fetchApi, status, statusText, data, error, isLoading };
};

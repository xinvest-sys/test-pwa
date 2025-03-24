import { Fetch } from '../utils/fetch';
import {
  TClientAccount,
  TClientAccountCreate,
  TClientProfile,
  TStreamingCredential,
  TVerifyPin,
} from 'types';

export async function getClientProfile(userId: string, token: string) {
  const slug = `api/client/${userId}/profile`;
  const url =  `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  const data = await new Fetch<TClientProfile>()
    .setUrl(url)
    .setToken(token)
    .GET();
  return data;
}

export async function createClientProfile(profile: TClientProfile, token: string) {
  if (!profile) {
    throw new Error('Profile cannot be null.');
  }
  /// send empty uuid (userid) for new creation
  const slug = `api/client/00000000-0000-0000-0000-000000000000/profile`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<TClientProfile>()
    .setUrl(url)
    .setToken(token)
    .setBody(profile)
    .POST();
}

export async function updateClientProfile(profile: TClientProfile, token: string) {
  if (!profile) {
    throw new Error('Profile is required.');
  }
  
  const slug = `api/client/${profile.id}/profile`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<TClientProfile>()
    .setUrl(url)
    .setToken(token)
    .setBody(profile)
    .PUT();
}

export async function getClientAccounts(userId: string, token: string): Promise<TClientAccount[]> {
  const slug = `api/client/${userId}/accounts`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  const data = await new Fetch<TClientAccount[]>()
    .setUrl(url)
    .setToken(token)
    .GET();
  return data;
}

export async function createClientAccount(userId: string, newAccount: TClientAccountCreate, token: string) {
  if (!newAccount) {
    throw new Error('Profile is required.');
  }
  const slug = `api/client/${userId}/accounts`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<TClientAccountCreate>()
    .setUrl(url)
    .setToken(token)
    .setBody(newAccount)
    .POST();
}

export async function deleteClientAccount(accountId: string, token: string) {
  const slug = `api/client/accounts/${accountId}`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch()
    .setUrl(url)
    .setToken(token)
    .DELETE();
}

export async function verifyPin(pin: TVerifyPin, token: string) {
  const slug = `api/client/verify-pin`;
  const url =  `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<TVerifyPin>()
    .setUrl(url)
    .setToken(token)
    .setBody(pin)
    .POST();
}

export async function getStreamingInfo(userId: string, token: string) {

  const slug = `api/client/${userId}/streaming-info`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  const data = await new Fetch<TStreamingCredential>()
    .setUrl(url)
    .setToken(token)
    .GET();
  
  return data;
} 

export function getLocalStreamingInfo(
  userId: string
): TStreamingCredential | undefined {
  const localStorage = window.localStorage;
  if (!localStorage.length) return undefined;

  if (
    !localStorage.getItem("country") ||
    !localStorage.getItem("isDemo") ||
    !localStorage.getItem("url") ||
    !localStorage.getItem("caid") ||
    !localStorage.getItem("cst") ||
    !localStorage.getItem("xst")
  )
    return undefined;

  const streamingCredential: TStreamingCredential = {
    id: userId,
    country: localStorage.getItem("country")!,
    isDemo: localStorage.getItem("isDemo")! === "true",
    url: localStorage.getItem("url")!,
    caid: localStorage.getItem("caid")!,
    cst: localStorage.getItem("cst")!,
    xst: localStorage.getItem("xst")!,
  };
  return streamingCredential;
}

export function setLocalStreamingInfo(streamingInfo: TStreamingCredential) {
  window.localStorage.setItem("country", streamingInfo.country);
  window.localStorage.setItem("isDemo", streamingInfo.isDemo.toString());
  window.localStorage.setItem("url", streamingInfo.url);
  window.localStorage.setItem("caid", streamingInfo.caid);
  window.localStorage.setItem("cst", streamingInfo.cst);
  window.localStorage.setItem("xst", streamingInfo.xst);
}
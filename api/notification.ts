import { Fetch } from '@/utils/fetch';
import { TNotificationLog, TNotificationLogInfo } from '../types';

export async function createSubscription(userId: string, sub: PushSubscription, token: string) {
  const slug = `api/notification/webpush/subscription?userId=${userId}`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<PushSubscription>()
    .setUrl(url)
    .setToken(token)
    .setBody(sub)
    .POST();
}

export async function deleteSubscription(endpoint: string, token: string) {
  const slug = 'api/notification/webpush/subscription';
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<{ endpoint: string }>()
    .setUrl(url)
    .setToken(token)
    .setBody({ endpoint: endpoint })
    .DELETE();
}

export async function test(userId: string, token: string) {
  const slug = `api/notification/webpush/test?userId=${userId}`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<PushSubscription>()
    .setUrl(url)
    .setToken(token)
    .POST();
}

export async function getLogs(userId: string, token: string) {
  const slug = `api/notification/webpush/logs?userId=${userId}`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<TNotificationLogInfo>()
    .setUrl(url)
    .setToken(token)
    .GET();
}

export async function getTestLogs(userId: string, token: string) {
  const slug = `api/notification/webpush/logs/only-test?userId=${userId}`;
  const url = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/${slug}`;
  return await new Fetch<TNotificationLog[]>()
    .setUrl(url)
    .setToken(token)
    .GET();
}
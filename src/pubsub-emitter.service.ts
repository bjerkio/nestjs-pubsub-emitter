import { PubSub } from '@google-cloud/pubsub';
import { Injectable } from '@nestjs/common';
import { Subscriber } from './types';

export type EventMap = {
  [key: string]: unknown;
};

@Injectable()
export class PubsubEmitterService<Events extends EventMap> {
  constructor(readonly subscribers: Subscriber[], readonly pubsub: PubSub) {}

  async emit<E extends keyof Events>(
    eventName: E,
    eventData: Events[E],
  ): Promise<void> {
    await Promise.all(
      this.subscribers
        .filter(subscriber => subscriber.eventName === eventName)
        .map(subscriber => {
          return this.pubsub.topic(subscriber.topicName).publishMessage({
            json: { eventName, data: eventData },
          });
        }),
    );
  }
}

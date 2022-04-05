import { PubSub } from '@google-cloud/pubsub';
import { Inject, Injectable } from '@nestjs/common';
import { PUBSUB_EMITTER_OPTIONS } from './constants';
import { PubSubEmitterOptions } from './types';

export type EventMap = {
  [key: string]: unknown;
};

@Injectable()
export class PubsubEmitterService<Events extends EventMap> {
  constructor(
    @Inject(PUBSUB_EMITTER_OPTIONS) readonly options: PubSubEmitterOptions,
    readonly pubsub: PubSub,
  ) {}

  async emit<E extends keyof Events>(
    eventName: E,
    eventData: Events[E],
  ): Promise<void> {
    await Promise.all(
      this.options.subscribers
        .filter(subscriber => subscriber.eventName === eventName)
        .map(subscriber => {
          return this.pubsub.topic(subscriber.topicName).publishMessage({
            json: { eventName, data: eventData },
          });
        }),
    );
  }
}

import { ClientConfig } from '@google-cloud/pubsub';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface Subscriber {
  eventName: string;
  topicName: string;
}

export interface PubSubEmitterOptions {
  pubsubClientConfig?: ClientConfig;
  subscribers: Subscriber[];
}

export interface PubSubEmitterSyncOptions extends PubSubEmitterOptions {
  // If true, registers `PubSubEmitterModule` as a global module.
  isGlobal?: boolean;
}

export interface PubSubEmitterAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<PubSubEmitterOptionsFactory>;
  useFactory?: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<PubSubEmitterOptions> | PubSubEmitterOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  useExisting?: Type<PubSubEmitterOptionsFactory>;

  // If true, registers `PubSubEmitterModule` as a global module.
  isGlobal?: boolean;
}

export interface PubSubEmitterOptionsFactory {
  pubsubOptionsModuleOptions():
    | Promise<PubSubEmitterOptions>
    | PubSubEmitterOptions;
}

import { ClientConfig } from '@google-cloud/pubsub';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface Subscriber {
  eventName: string;
  topicName: string;
}

export interface PubSubEmitterOptions {
  pubsubClientConfig?: ClientConfig;
}

export interface PubSubEmitterSyncOptions extends PubSubEmitterOptions {
  // If true, registers `SlackModule` as a global module.
  isGlobal?: boolean;
}

export interface PubSubEmitterAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<PubSubEmitterOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PubSubEmitterOptions> | PubSubEmitterOptions;
  inject?: any[];
  useExisting?: Type<PubSubEmitterOptionsFactory>;

  // If true, registers `SlackModule` as a global module.
  isGlobal?: boolean;
}

export interface PubSubEmitterOptionsFactory {
  pubsubOptionsModuleOptions():
    | Promise<PubSubEmitterOptions>
    | PubSubEmitterOptions;
}

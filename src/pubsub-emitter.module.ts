import { PubSub } from '@google-cloud/pubsub';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import invariant from 'ts-invariant';
import {
  PUBSUB_EMITTER_OPTIONS,
  PUBSUB_EMITTER_USER_OPTIONS,
} from './constants';
import { PubsubEmitterService } from './pubsub-emitter.service';
import {
  PubSubEmitterAsyncOptions,
  PubSubEmitterOptions,
  PubSubEmitterOptionsFactory,
  PubSubEmitterSyncOptions,
} from './types';

@Module({
  providers: [PubsubEmitterService],
  exports: [PubsubEmitterService],
})
export class PubSubEmitterModule {
  static forRoot(opts: PubSubEmitterSyncOptions): DynamicModule {
    const providers = [
      {
        provide: PUBSUB_EMITTER_USER_OPTIONS,
        useValue: opts,
      },
      this.createAsyncOptions(),
      this.createAsyncPubSub(),
    ];

    return {
      global: opts.isGlobal,
      module: PubSubEmitterModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(opts: PubSubEmitterAsyncOptions): DynamicModule {
    const providers = [
      this.createAsyncOptionsProvider(opts),
      this.createAsyncOptions(),
      this.createAsyncPubSub(),
    ];

    return {
      global: opts.isGlobal,
      module: PubSubEmitterModule,
      imports: opts.imports,
      providers,
      exports: providers,
    };
  }

  private static createAsyncOptionsProvider(
    opts: PubSubEmitterAsyncOptions,
  ): Provider {
    if (opts.useFactory) {
      return {
        provide: PUBSUB_EMITTER_USER_OPTIONS,
        useFactory: opts.useFactory,
        inject: opts.inject || [],
      };
    }

    invariant(opts.useClass);

    return {
      provide: PUBSUB_EMITTER_USER_OPTIONS,
      useFactory: async (
        optionsFactory: PubSubEmitterOptionsFactory,
      ): Promise<PubSubEmitterOptions> =>
        optionsFactory.pubsubOptionsModuleOptions(),
      inject: [opts.useClass],
    };
  }

  private static createAsyncOptions(): Provider {
    return {
      provide: PUBSUB_EMITTER_OPTIONS,
      inject: [PUBSUB_EMITTER_USER_OPTIONS],
      useFactory: async (opts: PubSubEmitterOptions) => {
        return {
          ...opts,
        };
      },
    };
  }

  private static createAsyncPubSub(): Provider {
    return {
      provide: PubSub,
      inject: [PUBSUB_EMITTER_OPTIONS],
      useFactory: async (opts: PubSubEmitterOptions) => {
        return new PubSub(opts.pubsubClientConfig);
      },
    };
  }
}

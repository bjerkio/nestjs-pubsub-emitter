import { PubsubEmitterService } from '../pubsub-emitter.service';

describe('pubsub-emitter.service', () => {
  it('should emit events', async () => {
    type Events = {
      hello: { type: 'boat' | 'car'; name: string };
      world: { service: 'github' | 'gitlab'; isGood: boolean };
    };
    const publishMessage = jest.fn();
    const service = new PubsubEmitterService<Events>(
      { subscribers: [{ eventName: 'hello', topicName: '' }] },
      {
        topic: () => ({
          publishMessage,
        }),
      } as any,
    );

    service.emit('hello', { type: 'boat', name: 'borris' });

    expect(publishMessage).toHaveBeenCalledWith({
      json: { eventName: 'hello', data: { type: 'boat', name: 'borris' } },
    });
  });
});

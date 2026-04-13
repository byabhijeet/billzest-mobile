// TODO: Integrate with React Query invalidation or remove
import { supabase } from './supabaseClient';

export type RealtimeSubscription = {
  unsubscribe: () => void;
};

const makeChannel = (name: string) =>
  supabase.channel(name, { config: { broadcast: { ack: true } } });

export const realtimeService = {
  onProductsChanged(callback: (payload: any) => void): RealtimeSubscription {
    const channel = makeChannel('products-updates');
    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        payload => {
          callback(payload);
        },
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },

  onOrdersChanged(callback: (payload: any) => void): RealtimeSubscription {
    const channel = makeChannel('orders-updates');
    channel
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        payload => {
          callback(payload);
        },
      )
      .subscribe();

    return {
      unsubscribe: () => {
        supabase.removeChannel(channel);
      },
    };
  },
};

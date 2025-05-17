import {create} from 'zustand';
import {zustandStorage} from './mmkvStorage';
import {createWithEqualityFn} from 'zustand/traditional';
import {createJSONStorage, persist} from 'zustand/middleware';
import {schema, StoreSchema, StoreSetters} from './storeTypes';
import setters from './setters';

interface UseStoreHookTypes extends StoreSchema, StoreSetters {}

export const useSearchStore = createWithEqualityFn<UseStoreHookTypes>()(
  persist(
    (set, get) => ({
      ...schema,
      ...setters(set, get),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => {
        const {searchHistory} = state;
        return {searchHistory};
      },
    },
  ),
  Object.is,
);

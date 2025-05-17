import {StoreSchema, StoreSetters} from './storeTypes';

const setters: (
  set: (param: Partial<StoreSchema>) => void,
  get: () => StoreSchema,
) => StoreSetters = (set, get) => ({
  addSearchHistoryItem: item => {
    const current = get().searchHistory;
    const updated = [
      item,
      ...current.filter(i => i.place_id !== item.place_id),
    ];
    set({searchHistory: updated});
  },
  clearSearchHistory: () => {
    set({searchHistory: []});
  },
});

export default setters;

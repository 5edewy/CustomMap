export interface StoreSchema {
  searchHistory: PlaceItem[];
}

export interface StoreSetters {
  addSearchHistoryItem: (item: StoreSchema['searchHistory'][0]) => void;
  clearSearchHistory: () => void;
}

export const schema: StoreSchema = {
  searchHistory: [],
};

export interface PlaceItem {
  place_id: string;
  latitude: number;
  longitude: number;
  description: string;
}

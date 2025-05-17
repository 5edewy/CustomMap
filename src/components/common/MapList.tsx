import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {AppText} from './AppText';
import styles from '../assets/styles/styles';

export interface PlaceItem {
  place_id: string;
  description: string;
  latitude?: number;
  longitude?: number;
}

interface MapListProps {
  dataArr: PlaceItem[];
  onPress: (item: PlaceItem) => void;
  onPressClear?: () => void;
  showRecentTag?: boolean;
}

export const MapList = ({
  dataArr,
  onPress = () => {},
  onPressClear = () => {},
  showRecentTag,
}: MapListProps) => {
  return (
    <View style={styles.listContainer}>
      {showRecentTag && (
        <View style={styles.recentView}>
          <AppText style={styles.recentText}>{'Recent Searches'}</AppText>
          <TouchableOpacity onPress={onPressClear}>
            <AppText style={styles.clearRecentText}>{'Clear'}</AppText>
          </TouchableOpacity>
        </View>
      )}

      {dataArr.map((item, index: React.Key | null | undefined) => (
        <TouchableOpacity key={index} onPress={() => onPress(item)}>
          <AppText style={styles.listText}>{item.description}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
};

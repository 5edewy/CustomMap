'use strict';
import {I18nManager, StyleSheet} from 'react-native';
import {colors, scale, sw} from '../../../config/theme';

const styles = StyleSheet.create({
  // HOME_SCREEN
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  //   MAP Components
  listContainer: {
    backgroundColor: colors.whiteSmoke,
    position: 'absolute',
    zIndex: 99,
    width: sw * 0.8,
    alignSelf: 'center',
    borderBottomEndRadius: scale(20),
    borderBottomStartRadius: scale(20),
    paddingTop: scale(8),
    opacity: 0.9,
    top: scale(50),
  },
  listText: {
    textAlign: 'center',
    borderBottomWidth: 0.5,
    paddingVertical: scale(6),
  },
  recentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(10),
    paddingBottom: scale(8),
    borderBottomWidth: 0.5,
    borderBottomColor: colors.gray,
  },
  recentText: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  clearRecentText: {
    color: colors.primary,
    fontWeight: '600',
  },
  getLocationButton: {
    position: 'absolute',
    bottom: scale(10),
    right: scale(10),
    backgroundColor: '#fff',
    width: scale(30),
    height: scale(30),
    borderRadius: scale(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPin: {
    position: 'absolute',
    alignSelf: 'center',
  },
  inputMapHolder: {
    width: sw * 0.8,
    position: 'absolute',
    zIndex: 99,
    top: scale(6),
    alignSelf: 'center',
  },
});

export default styles;

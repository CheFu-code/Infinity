import Constants from 'expo-constants';

export const getBundleId = () => {
  return Constants.expoConfig?.android?.package ?? '';
};

export const getVersion = () => {
  return Constants.expoConfig?.version ?? '1.0.0';
};

export default {
  getBundleId,
  getVersion,
};
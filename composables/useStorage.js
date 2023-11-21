import { Storage } from '../services/storage';
export const useStorage = () => {
  return Storage.instance();
}

import { Storage } from '../services/storage';
export const useStorage = () => {
  const storage = new Storage();
  return { storage };
}
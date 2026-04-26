import { getStorage } from 'firebase/storage';
import { app } from './firebase'; // need to export app

export const storage = getStorage(app);

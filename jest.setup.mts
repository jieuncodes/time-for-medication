// jest.setup.mts 

import 'reflect-metadata';
import dotenv from 'dotenv';
import { jest } from '@jest/globals';

dotenv.config({ path: './.env.test' });
global.jest = jest;
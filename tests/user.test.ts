//tests/user.test.ts 

import { User } from '../src/entities/User';
import bcrypt from 'bcrypt';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.username = 'testuser';
    user.password = 'password123';
  });

  it('should hash the password before saving', async () => {
    await user.hashPassword();
    expect(user.password).not.toBe('password123');
    expect(bcrypt.compareSync('password123', user.password)).toBeTruthy();
  });

  it('should validate a correct password', async () => {
    await user.hashPassword();
    const isValid = await user.validatePassword('password123');
    expect(isValid).toBeTruthy();
  });

  it('should not validate an incorrect password', async () => {
    await user.hashPassword();
    const isInvalid = await user.validatePassword('wrongpassword');
    expect(isInvalid).toBeFalsy();
  });
});

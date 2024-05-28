//tests/user.test.mts 

import { User } from '../src/models/User.mts';
import bcrypt from 'bcrypt';


describe('User Entity', () => {
  let user: User;

  beforeAll(async () => {
    user = new User();
    user.username = 'testuser';
    user.password = 'Password123!';
    await user.hashPassword(); //manually hash the password, not to use register api
  });


  test('should hash the password before saving', async () => {
    expect(user.password).not.toBe('Password123!');
    expect(bcrypt.compareSync('Password123!', user.password)).toBeTruthy();
  });

  test('should validate a correct password', async () => {
    const isValid = await user.validatePassword('Password123!');
    expect(isValid).toBeTruthy();
  });

  test('should not validate an incorrect password', async () => {
    const isInvalid = await user.validatePassword('wrongpassword');
    expect(isInvalid).toBeFalsy();
  });
});

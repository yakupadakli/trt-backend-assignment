const { Types } = require('mongoose');

const UserFactory = require('../../factories/user.factory');
const UserDataAccess = require('../../../src/data-access/user.data-access');

describe('UserDataAccess', () => {
  let userDataAccess;
  let user;
  let user1;

  beforeEach(async () => {
    jest.clearAllMocks();
    userDataAccess = new UserDataAccess();

    [user, user1] = await Promise.all(
      UserFactory.buildList(2, {}, { saveDb: true }),
    );
  });

  describe('filterUsers', () => {
    it('should return a list of users', async () => {
      const users = await userDataAccess.filterUsers();

      const userNames = users.map((user) => user.name).sort();
      const exceptedUserNames = [user.name, user1.name].sort();

      expect(users).toHaveLength(2);
      expect(userNames).toStrictEqual(exceptedUserNames);
    });

    it('should return a list of users with a filter', async () => {
      const users = await userDataAccess.filterUsers({
        name: user.name,
      });

      expect(users).toHaveLength(1);
      expect(users).toStrictEqual([user]);
    });

    it('should return an empty list of users', async () => {
      const users = await userDataAccess.filterUsers({
        name: 'invalid',
      });

      expect(users).toHaveLength(0);
    });
  });

  describe('findByEmail', () => {
    it('should return a user', async () => {
      const foundUser = await userDataAccess.findByEmail(user.email);

      expect(foundUser).toStrictEqual(user);
    });

    it('should return null', async () => {
      const foundUser = await userDataAccess.findByEmail('invalid');

      expect(foundUser).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const getUniqueEmail = () => `test-${Date.now()}@example.com`;
      const email = getUniqueEmail();

      const newUser = await userDataAccess.createUser({
        name: 'Test',
        surname: 'test',
        username: 'test',
        email,
        password: 'password',
      });

      expect(newUser).toHaveProperty('_id');
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('name');
      expect(newUser).toHaveProperty('surname');
      expect(newUser).toHaveProperty('username');
      expect(newUser).toHaveProperty('email');
      expect(newUser).toHaveProperty('createdAt');
      expect(newUser).toHaveProperty('updatedAt');
      expect(newUser.name).toBe('Test');
      expect(newUser.surname).toBe('test');
      expect(newUser.username).toBe('test');
      expect(newUser.email).toBe(email);
    });

    it('should email be unique', async () => {
      const email = user.email;

      try {
        await userDataAccess.createUser({
          name: 'Test',
          username: 'test',
          email,
          password: 'password',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it('should username be unique', async () => {
      const username = user.username;
      const getUniqueEmail = () => `test-${Date.now()}@example.com`;
      const email = getUniqueEmail();

      try {
        await userDataAccess.createUser({
          name: 'Test',
          username,
          email,
          password: 'password',
        });
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe('getById', () => {
    it('should return a user', async () => {
      const foundUser = await userDataAccess.getById(user.id);

      expect(foundUser).toStrictEqual(user);
    });

    it('should return null', async () => {
      const invalidUserId = new Types.ObjectId();
      const foundUser = await userDataAccess.getById(invalidUserId);

      expect(foundUser).toBeNull();
    });
  });
});

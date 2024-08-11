const UserFactory = require('../../factories/user.factory');
const BaseDataAccess = require('../../../src/core/core.data-access');

const User = require('../../../src/models/user.model');

describe('BaseDataAccess', () => {
  let baseDataAccess;
  let user;

  beforeEach(async () => {
    jest.clearAllMocks();
    baseDataAccess = new BaseDataAccess(User);

    [user] = await Promise.all(UserFactory.buildList(2, {}, { saveDb: true }));
  });

  describe('_getAll', () => {
    it('should return all records', async () => {
      const users = await baseDataAccess._getAll();

      expect(users).toHaveLength(2);
    });

    it('should return all records with query', async () => {
      const users = await baseDataAccess._getAll({ _id: user._id });

      expect(users).toHaveLength(1);
    });
  });

  describe('_getAllPaginated', () => {
    it('should return all records paginated', async () => {
      const users = await baseDataAccess._getAllPaginated();

      expect(users.docs).toHaveLength(2);
    });

    it('should return all records paginated with query', async () => {
      const users = await baseDataAccess._getAllPaginated({ _id: user._id });

      expect(users.docs).toHaveLength(1);
    });
  });

  describe('_get', () => {
    it('should return a record', async () => {
      const userResult = await baseDataAccess._get({ _id: user._id });

      expect(userResult).toHaveProperty('email');
    });
  });

  describe('_update', () => {
    it('should update a record', async () => {
      const updatedUser = await baseDataAccess._update(
        { _id: user._id },
        { email: 'example@example.com' },
      );

      expect(updatedUser.email).toBe('example@example.com');
    });
  });

  describe('_delete', () => {
    it('should delete a record', async () => {
      await baseDataAccess._delete({ _id: user._id });

      const users = await baseDataAccess._getAll();

      expect(users).toHaveLength(1);
    });
  });

  describe('_create', () => {
    it('should create a record', async () => {
      const newUser = await baseDataAccess._create({
        email: 'example@example.com',
        username: 'example',
        password: 'password',
      });

      expect(newUser.email).toBe('example@example.com');

      const users = await baseDataAccess._getAll();

      expect(users).toHaveLength(3);
    });
  });
});

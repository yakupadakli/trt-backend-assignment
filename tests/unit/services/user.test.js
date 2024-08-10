const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserService = require('../../../src/services/user.service');
const UserDataAccess = require('../../../src/data-access/user.data-access');
const userMock = require('../../mocks/user.mock');
const config = require('../../../src/config')();
const {
  EmailOrPasswordIncorrectError,
  UserAlreadyExistsError,
} = require('../../../src/errors');

jest.mock('../../../src/data-access/user.data-access');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Service', () => {
  let userService;
  let mockDataAccess;

  const mockJwtSign = jwt.sign;
  const mockBcryptCompare = bcrypt.compare;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockDataAccess = new UserDataAccess();

    userService = new UserService();

    userService.dataAccess = mockDataAccess;
  });

  describe('generateToken', () => {
    it('should generate a token', async () => {
      const user = await userMock.getUser();
      const token = 'token';

      mockJwtSign.mockReturnValue(token);

      const result = await userService.generateToken(user);

      expect(mockJwtSign).toHaveBeenCalledTimes(1);
      expect(result.token).toBe(token);
      expect(result.expiresIn).toBe(config.jwt.expiresIn);
      expect(result.tokenType).toBe(config.authTokenType);
    });

    it('should throw an error when generating a token', async () => {
      const user = await userMock.getUser();

      mockJwtSign.mockImplementation(() => {
        throw new Error();
      });

      await expect(userService.generateToken(user)).rejects.toThrow();
    });
  });

  describe('login', () => {
    it('should return a token', async () => {
      const user = await userMock.getUser();
      const password = 'password';
      const token = 'token';

      mockJwtSign.mockReturnValue(token);
      mockBcryptCompare.mockResolvedValue(true);

      mockDataAccess.findByEmail.mockResolvedValue(user);

      const result = await userService.login(user.email, password);

      expect(mockDataAccess.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.findByEmail).toHaveBeenCalledWith(user.email);

      expect(mockBcryptCompare).toHaveBeenCalledWith(password, user.password);
      expect(mockBcryptCompare).toHaveBeenCalledTimes(1);

      expect(mockJwtSign).toHaveBeenCalledTimes(1);

      expect(result.token).toBe(token);
      expect(result.expiresIn).toBe(config.jwt.expiresIn);
      expect(result.tokenType).toBe(config.authTokenType);
    });

    it('should throw an error when the password is incorrect', async () => {
      const user = await userMock.getUser();
      const password = 'password';

      mockDataAccess.findByEmail.mockResolvedValue(user);
      mockBcryptCompare.mockResolvedValue(false);

      await expect(userService.login(user.email, password)).rejects.toThrow(
        EmailOrPasswordIncorrectError,
      );
    });

    it('should throw an error when the user is not found', async () => {
      const email = 'email';
      const password = 'password';

      mockDataAccess.findByEmail.mockResolvedValue(null);

      await expect(userService.login(email, password)).rejects.toThrow(
        EmailOrPasswordIncorrectError,
      );
    });

    it('should throw an error when an error occurs', async () => {
      const email = 'email';
      const password = 'password';

      mockDataAccess.findByEmail.mockRejectedValue(new Error());

      await expect(userService.login(email, password)).rejects.toThrow();
    });
  });

  describe('register', () => {
    it('should register a user', async () => {
      const user = await userMock.getUser();

      mockDataAccess.filterUsers.mockResolvedValue([]);
      mockDataAccess.createUser.mockResolvedValue(user);

      const result = await userService.register(user);

      expect(mockDataAccess.filterUsers).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.filterUsers).toHaveBeenCalledWith({
        $or: [{ username: user.username }, { email: user.email }],
      });

      expect(mockDataAccess.createUser).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.createUser).toHaveBeenCalledWith(user);

      expect(result).toBe(user);
    });

    it('should throw an error when the user already exists', async () => {
      const user = await userMock.getUser();

      mockDataAccess.filterUsers.mockResolvedValue([user]);

      await expect(userService.register(user)).rejects.toThrow(
        UserAlreadyExistsError,
      );
    });

    it('should throw an error when an error occurs', async () => {
      const user = await userMock.getUser();

      mockDataAccess.filterUsers.mockRejectedValue(new Error());

      await expect(userService.register(user)).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    it('should get a user by id', async () => {
      const user = await userMock.getUser();

      mockDataAccess.getById.mockResolvedValue(user);

      const result = await userService.getUserById(user.id);

      expect(mockDataAccess.getById).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getById).toHaveBeenCalledWith(user.id);

      expect(result).toBe(user);
    });

    it('should return null when the user is not found', async () => {
      const userId = 'userId';

      mockDataAccess.getById.mockResolvedValue(null);

      const result = await userService.getUserById(userId);

      expect(mockDataAccess.getById).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.getById).toHaveBeenCalledWith(userId);

      expect(result).toBeNull();
    });

    it('should throw an error when an error occurs', async () => {
      const userId = 'userId';

      mockDataAccess.getById.mockRejectedValue(new Error());

      await expect(userService.getUserById(userId)).rejects.toThrow();
    });
  });

  describe('getGoogleUserToken', () => {
    it('should get a token for a Google user', async () => {
      const user = await userMock.getUser();
      const email = 'example@example.com';
      const token = 'token';

      mockDataAccess.findByEmail
        .mockImplementationOnce(() => null)
        .mockImplementationOnce(() => Promise.resolve(user));

      mockDataAccess.createUser.mockResolvedValue(user);

      mockJwtSign.mockReturnValue(token);

      const result = await userService.getGoogleUserToken({ email });

      expect(mockDataAccess.findByEmail).toHaveBeenCalledTimes(2);
      expect(mockDataAccess.findByEmail).toHaveBeenCalledWith(email);

      expect(mockDataAccess.createUser).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.createUser).toHaveBeenCalledWith({
        email,
        password: expect.any(String),
      });

      expect(mockJwtSign).toHaveBeenCalledTimes(1);

      expect(result.token).toBe(token);
      expect(result.expiresIn).toBe(config.jwt.expiresIn);
      expect(result.tokenType).toBe(config.authTokenType);
    });

    it('should get a token for an existing Google user', async () => {
      const user = await userMock.getUser();
      const email = 'email';
      const token = 'token';

      mockDataAccess.findByEmail.mockResolvedValue(user);

      mockJwtSign.mockReturnValue(token);

      const result = await userService.getGoogleUserToken({ email });

      expect(mockDataAccess.findByEmail).toHaveBeenCalledTimes(1);
      expect(mockDataAccess.findByEmail).toHaveBeenCalledWith(email);

      expect(mockDataAccess.createUser).not.toHaveBeenCalled();

      expect(mockJwtSign).toHaveBeenCalledTimes(1);

      expect(result.token).toBe(token);
      expect(result.expiresIn).toBe(config.jwt.expiresIn);
      expect(result.tokenType).toBe(config.authTokenType);
    });

    it('should throw an error when an error occurs', async () => {
      const email = 'email';

      mockDataAccess.findByEmail.mockRejectedValue(new Error());

      await expect(userService.getGoogleUserToken({ email })).rejects.toThrow();
    });
  });
});

Strategies = require("./strategies.js");

jest.mock('cron');

describe('Test get strategies', () => {
  it('should return a list of strategies', async () => {
    const result = Strategies.MessageStrategy.getStrategies(null);
    expect(Object.keys(result).length).toBeGreaterThan(0);
  });

//   it('should return a List of user with promise', done => {
//     getUsers().then(result => {
//       expect(result.length).toBeGreaterThan(0);
//       done();
//     });
//   });

//   it('should return a user', () => {
//     return getUserById(1).then(result => {
//       expect(result.id).toBe(1);
//     });
//   });

//   it('should return an error when user not found', async () => {
//     try {
//       expect.assertions(1);
//       const result = await getUserById();
//     } catch (err) {
//       expect(err.message).toMatch('code 404');
//     }
//   });
});
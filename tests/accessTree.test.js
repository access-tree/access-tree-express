import {describe, expect, test} from '@jest/globals';
import AccessTree from '../AccessTree';
const userData = require('../examples/userData.json');

describe('AccessTree', () => {

  let tree = new AccessTree("root");
  tree.readUserFile(userData);

  test('readUserFile and listUsers method PASS', () => {
    const users = tree.listUsers();
    expect(users.length).toBe(4);
  });
  test('find method PASS', () => {
    const perm = tree.find(["john","api","home","data","chicken", "legs", "raw", "GET"])
    expect(perm).toBe("6");
  });
  test('addUri method PASS', () => {
    tree.addUri("/bob/api/can/run/GET/4")
    const perm = tree.find(["bob","api","can","run","GET"])
    expect(perm).toBe("4");
  });

  test('removeUser method PASS', () => {
    tree.addUri("/bob/api/can/run/GET/4")
    tree.removeUser("bob");
    const perm = tree.find(["bob","api","can","run","GET"])
    expect(perm).toBe(0);
  });
});
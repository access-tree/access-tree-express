import {describe, expect, test} from '@jest/globals';
import Node from '../tree/Node';

describe('Node', () => {
  const node = new Node('hello');
  test('can instantiate node object', () => {
    
    expect(node.data).toContain('hello');
  });
});
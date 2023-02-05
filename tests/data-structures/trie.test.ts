class TrieNode {
  nodes: Map<string, TrieNode>;
  leaf: boolean;
  // suggestions: string[];
  constructor() {
    this.nodes = new Map();
    this.leaf = false;
  }

  // This is for testing purposes
  public recursePrint(
    parent: string,
    key: string,
    node: TrieNode,
    indent = '   ',
  ) {
    const childrens = [...node.nodes.entries()];
    const childrenStrs = childrens
      .map((cur) => this.recursePrint(key, cur[0], cur[1], indent + '    '))
      .join(',\n');
    let str = `${indent}\{ parent = ${parent} key = ${key}, leaf = ${node.leaf} childrens = \n`;
    str = str + childrenStrs + `${indent}\}\n`;
    return str;
  }
}

class Trie {
  root: TrieNode;
  constructor() {
    this.root = new TrieNode();
  }

  insert(word: string): void {
    let current = this.root;
    for (const char of word) {
      if (!current.nodes.get(char)) {
        current.nodes.set(char, new TrieNode());
      }
      current = current.nodes.get(char);
    }
    current.leaf = true;
  }

  search(word: string, prefixMatch = false): boolean {
    let current = this.root;
    for (const char of word) {
      if (!current.nodes.get(char)) {
        return false;
      }
      current = current.nodes.get(char);
    }
    return prefixMatch ? true : current.leaf;
  }

  startsWith(prefix: string): boolean {
    return this.search(prefix, true);
  }

  suggestions(word: string): string[] {
    let current = this.root;
    for (const char of word) {
      if (!current.nodes.get(char)) {
        break;
      }
      current = current.nodes.get(char);
    }
    const arr = this.getSuggestionsRec(current, [], '');
    return arr.map((str) => word + str);
  }

  private getSuggestionsRec(node: TrieNode, out: string[], str: string) {
    if (node.leaf) {
      out.push(str);
    }
    for (const key of node.nodes.entries()) {
      const newStr = str + key[0];
      this.getSuggestionsRec(key[1], out, newStr);
    }
    return out;
  }
  toString() {
    return `${this.root.recursePrint('root', 'none', this.root, '')}`;
  }
}

describe('Simple Trie Test', () => {
  it('test that  trie works', async () => {
    const trie = new Trie();
    trie.insert('deepak');
    trie.insert('den');
    trie.insert('deep');
    trie.insert('d');
    trie.insert('');
    trie.insert('sun');
    expect(trie.search('den')).toBe(true);
    expect(trie.search('sun')).toBe(true);
    expect(trie.search('deepa')).toBe(false);
    expect(trie.search('')).toBe(true);
    expect(trie.search('d')).toBe(true);
    console.log(trie);
  });

  it('test that  trie works 2', async () => {
    const trie = new Trie();
    trie.insert('deepak');
    trie.insert('den');
    trie.insert('deep');
    trie.insert('sun');
    expect(trie.suggestions('dee').sort()).toEqual(['deepak', 'deep'].sort());
  });

  it('test that  trie works 3', async () => {
    const trie = new Trie();
    trie.insert('deepak');
    trie.insert('den');
    trie.insert('deep');
    trie.insert('sun');
    expect(trie.suggestions('').sort()).toEqual(
      ['deepak', 'deep', 'den', 'sun'].sort(),
    );
  });
});

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }

    const value = this.cache.get(key);

    this.cache.delete(key);
    this.cache.set(key, value);
  }
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  print() {
    console.log([...this.cache.entries()]);
  }
}

const cache = new LRUCache(3);

cache.put("a", 1); // a
cache.put("b", 2); // a, b
cache.put("c", 3); // a, b, c
cache.get("a"); // b, c, a
cache.put("d", 4); // c, a, d (evicts b)

cache.print();

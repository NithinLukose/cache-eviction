class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); //key-> {value,freq}
    this.freqMap = new Map(); //freq -> set of keys with this frequency
    this.minFreq = 0;
  }

  get(key) {
    if (!this.cache.has(key)) {
      return -1;
    }
    const { value, freq } = this.cache.get(key);

    this.freqMap.get(freq).delete(key);

    if (this.freqMap.get(freq).size === 0) {
      this.freqMap.delete(freq);
      if (this.minFreq === freq) {
        this.minFreq++;
      }
    }

    const newFreq = freq + 1;
    if (!this.freqMap.has(newFreq)) {
      this.freqMap.set(newFreq, new Set());
    }
    this.freqMap.get(newFreq).add(key);

    this.cache.set(key, { value, freq: freq + 1 });

    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const freq = this.cache.get(key).freq;
      this.cache.delete(key);
      this.cache.set(key, { value, freq: freq + 1 });
      this.freqMap.get(freq).delete(key);

      if (this.freqMap.get(freq).size === 0) {
        this.freqMap.delete(freq);
        if (this.minFreq === freq) {
          this.minFreq++;
        }
      }
      const newFreq = freq + 1;
      if (!this.freqMap.has(newFreq)) {
        this.freqMap.set(newFreq, new Set());
      }
      this.freqMap.get(newFreq).add(key);
    } else {
      if (this.cache.size >= this.capacity) {
        const keysWithMinFreq = this.freqMap.get(this.minFreq);
        const lfuKey = keysWithMinFreq.values().next().value;
        keysWithMinFreq.delete(lfuKey);
        if (keysWithMinFreq.size === 0) {
          this.freqMap.delete(this.minFreq);
        }
        this.cache.delete(lfuKey);
      }
      this.cache.set(key, { value, freq: 1 });
      if (!this.freqMap.has(1)) {
        this.freqMap.set(1, new Set());
      }
      this.freqMap.get(1).add(key);
      this.minFreq = 1;
    }
  }
  print() {
    console.log("Cache:", [...this.cache.entries()]);
    console.log(
      "FreqMap:",
      [...this.freqMap.entries()].map(([freq, keys]) => [freq, [...keys]])
    );
    console.log("MinFreq:", this.minFreq);
  }
}

const lfu = new LFUCache(3);

lfu.put("a", 1); // a: freq 1
lfu.put("b", 2); // b: freq 1
lfu.put("c", 3); // c: freq 1

lfu.get("a"); // a: freq 2
lfu.put("d", 4); // Evicts 'b' (freq 1, least recently used)

lfu.print();

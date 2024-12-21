import redis from "@/initializer/redis";

/**
 * カウンタークラス
 * @param identity カウンターの識別子
 * @param expire カウンターの有効期限(秒)
 */
class Counter {
  readonly #identity: string;
  readonly #expire: number;
  constructor(identity: string, expire: number) {
    this.#identity = identity;
    this.#expire = expire;
  }

  /**
   * キーの値をインクリメントする関数
   * @param key クラス内でのカウンターのキー
   * @returns number インクリメント後の値
   */
  async incrementCount(key: string): Promise<number> {
    const Innerkey = `${this.#identity}:${key}`;
    const currentValue = await redis.get(Innerkey);
    if (!currentValue) {
      await redis.set(Innerkey, 0, "EX", this.#expire);
      return 0;
    } else {
      const setValue = Number(currentValue) + 1;
      await redis.set(Innerkey, setValue, "EX", this.#expire);
      return setValue;
    }
  }

  /**
   * カウンターの値を取得する関数
   * インクリメントしない
   * @param key クラス内でのカウンターのキー
   * @returns number カウンターの値
   */
  async getCount(key: string): Promise<number> {
    const count = await redis.get(`${this.#identity}:${key}`);
    return Number(count) || 0;
  }
}

export default Counter;

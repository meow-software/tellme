import { SnowflakeGenerator, DEFAULT_SNOWFLAKE_EPOCH } from './isnowflake-generator.interface';

const customEpoch = 1609459200000; // Jan 1, 2021, as bigint

describe('SnowflakeGenerator (integration)', () => {
    it('should generate a bigint ID', () => {
        const generator = new SnowflakeGenerator(1);
        (generator as any).initSnowflake(); // Ensure initialization

        const id = generator.generate();

        expect(typeof id).toBe('bigint');
        expect(id > 0n).toBe(true);
    });

    it('should generate unique IDs', () => {
        const generator = new SnowflakeGenerator(1);

        const id1 = generator.generate();
        const id2 = generator.generate();

        expect(id1).not.toBe(id2);
    });


    it('should encode the correct workerId', () => {
        const workerId = 42;
        const generator = new SnowflakeGenerator(workerId);
        const id = generator.generate();
        // Extract workerId from bits 12–21
        const extractedWorkerId = (id >> 12n) & 0x3FFn;
        expect(Number(extractedWorkerId)).toBe(workerId);
    });

    it('should respect custom epoch', () => {
        const generator = new SnowflakeGenerator(1, customEpoch);
        const id = generator.generate();
        // Extract timestamp difference from bits 22–63
        const timestampDiff = id >> 22n;
        const approxNow = BigInt(Date.now() - customEpoch);
        // Check timestamp is close to "now - epoch"
        expect(Number(timestampDiff)).toBeGreaterThanOrEqual(Number(approxNow) - 10);
        expect(Number(timestampDiff)).toBeLessThanOrEqual(Number(approxNow) + 10);
    });

    it('should update epoch when calling setEpoch', () => {
        const generator = new SnowflakeGenerator(1);
        const oldId = generator.generate();
        generator.setEpoch(customEpoch);
        const newId = generator.generate();

        const oldTimestampDiff = oldId >> 22n;
        const newTimestampDiff = newId >> 22n;
        // The timestamp diff should be recalculated based on new epoch
        expect(newTimestampDiff).not.toBe(oldTimestampDiff);
    });

    it('should update workerId when calling setWorkerId', () => {
        const generator = new SnowflakeGenerator(1);
        generator.setWorkerId(99);
        const id = generator.generate();
        
        const extractedWorkerId = (id >> 12n) & 0x3FFn;
        expect(Number(extractedWorkerId)).toBe(99);
    });
});

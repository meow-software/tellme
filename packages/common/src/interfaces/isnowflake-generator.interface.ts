import Snowflake from 'snowflake-id';

export const DEFAULT_SNOWFLAKE_EPOCH = 1736572800000;  // Jan 11, 2025


/**
 * Interface for a Snowflake ID Generator.
 * Defines the required methods for generating and configuring a Snowflake ID.
 */
export interface ISnowflakeGenerator {
    setEpoch(epoch: number): void;  // Set the custom epoch (reference timestamp)
    setWorkerId(workerId: number): void;  // Set the worker/machine ID
    generate(): bigint;  // Method to generate a Snowflake ID
}

/**
 * Abstract base class for Snowflake ID generators.
 * Implements the core functionality for configuring the epoch and worker ID.
 */
export abstract class AbstractSnowflakeGenerator implements ISnowflakeGenerator {
    protected epoch: number = DEFAULT_SNOWFLAKE_EPOCH;  // Default epoch: Jan 11, 2025
    protected workerId: number;  // Worker ID

    /**
     * Constructor to initialize the Snowflake generator with a worker ID and optional epoch.
     * @param workerId The ID of the worker or machine.
     * @param epoch (Optional) The epoch to use for generating Snowflake IDs. Default epoch: Jan 11, 2025
     */
    constructor(workerId: number, epoch?: number) {
        this.workerId = workerId;
        if (epoch) this.setEpoch(epoch);  // Set the custom epoch if provided
    }

    /**
     * Set the custom epoch (reference timestamp) for generating Snowflake IDs.
     * @param epoch The custom epoch (timestamp in milliseconds).
     */
    setEpoch(epoch: number): void {
        if (epoch <= 0) {
            throw new Error("Epoch must be a positive number (in milliseconds).");
        }
        if (epoch > Date.now()) {
            throw new Error("Epoch cannot be in the future.");
        }

        this.epoch = epoch;
        this.initSnowflake();
    }

    /**
     * Set the worker ID for this instance of the Snowflake generator.
     * @param workerId The ID of the worker or machine generating the ID.
     */
    setWorkerId(workerId: number): void {
        if (!Number.isInteger(workerId)) {
            throw new Error("Worker ID must be an integer.");
        }
        if (workerId < 0 || workerId > 1023) {
            throw new Error("Worker ID must be between 0 and 1023.");
        }

        this.workerId = workerId;
        this.initSnowflake();
    }

    /**
     * Abstract method to generate a Snowflake ID.
     * This must be implemented in a subclass.
     */
    abstract generate(): bigint;

    /**
     * Internal helper to reinitialize the Snowflake instance whenever
     * the epoch or workerId changes.
     */
    protected abstract initSnowflake() : any;
}

/**
 * Concrete implementation of the Snowflake ID generator.
 * Extends the abstract class and implements the generate method using the Snowflake library.
 * 41 bits → timestamp (in ms since the configured epoch)
 * 10 bits → worker/machine ID
 * 12 bits → sequence (increment if multiple IDs are generated in the same ms)
 */
export class SnowflakeGenerator extends AbstractSnowflakeGenerator {
    private snowflake: Snowflake;  // Instance of the Snowflake library

    /**
     * Constructor to initialize the Snowflake generator with a worker ID and optional epoch.
     * It also sets up the Snowflake instance with the provided configurations.
     * @param workerId The ID of the worker or machine.
     * @param epoch (Optional) The epoch to use for generating Snowflake IDs.
     */
    constructor(workerId: number, epoch?: number) {
        super(workerId, epoch);  // Call the constructor of the abstract class
        if (workerId <0 ) throw Error('workerId cannot be negative');
        this.initSnowflake();
    }

    /**
     * Generates a new Snowflake ID as a string.
     * @returns A unique Snowflake ID as a string.
     */
    generate(): bigint {
        return BigInt(this.snowflake.generate());  // Generate and return the ID as a string
    }

    /**
     * Internal helper to reinitialize the Snowflake instance whenever
     * the epoch or workerId changes.
     */
    protected initSnowflake(): void {
        this.snowflake = new Snowflake({
            mid: this.workerId,
            offset: this.epoch,
        });
    }
    /**
    * Generates a new Snowflake ID and returns it as a string (API-friendly).
    * @returns the ID as a string.
    */
    generateAsString(): string {
        return this.generate().toString();
    }
    
    /**
    * Converts a bigint to a string.
    * @param id Snowflake to a bigint.
    */
    toString(id: bigint): string {
        return id.toString();
    }

    /**
    * Converts a string to a bigint.
    * @param id Snowflake to a string.
    */
    toBigInt(id: string): bigint {
        return BigInt(id);
    }

    /**
    * Extracts the data encoded in a snowflake.
    * Format:
    * - 41 bits = timestamp since epoch
    * - 10 bits = workerId
    * - 12 bits = increment (sequence)
    */
    deconstruct(id: bigint) {
        const epoch = this.epoch; // get your epoch 
        const binary = id.toString(2).padStart(64, '0');

        // Bit splitting 
        const timestampBits = binary.substring(0, 41);
        const workerBits = binary.substring(41, 51);
        const sequenceBits = binary.substring(51);

        const timestamp = parseInt(timestampBits, 2) + epoch;
        const workerId = parseInt(workerBits, 2);
        const sequence = parseInt(sequenceBits, 2);

        return {
            id: id.toString(),
            timestamp,
            workerId,
            sequence,
            date: new Date(timestamp),
        };
    }
}
import Snowflake from 'snowflake-id';

const DEFAULT_EPOCH = 1736572800000;  // Jan 11, 2025


/**
 * Interface for a Snowflake ID Generator.
 * Defines the required methods for generating and configuring a Snowflake ID.
 */
export interface ISnowflakeGenerator {
    setEpoch(epoch: number): void;  // Set the custom epoch (reference timestamp)
    setWorkerId(workerId: number): void;  // Set the worker/machine ID
    generate(): string;  // Method to generate a Snowflake ID
}

/**
 * Abstract base class for Snowflake ID generators.
 * Implements the core functionality for configuring the epoch and worker ID.
 */
export abstract class AbstractSnowflakeGenerator implements ISnowflakeGenerator {
    protected epoch: number = DEFAULT_EPOCH;  // Default epoch: Jan 11, 2025
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
        this.epoch = epoch;
    }

    /**
     * Set the worker ID for this instance of the Snowflake generator.
     * @param workerId The ID of the worker or machine generating the ID.
     */
    setWorkerId(workerId: number): void {
        this.workerId = workerId;
    }

    /**
     * Abstract method to generate a Snowflake ID.
     * This must be implemented in a subclass.
     */
    abstract generate(): string;
}

/**
 * Concrete implementation of the Snowflake ID generator.
 * Extends the abstract class and implements the generate method using the Snowflake library.
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
        this.snowflake = new Snowflake({
            mid : this.workerId,
            offset: this.epoch
        });  // Initialize the Snowflake library
    }

    /**
     * Generates a new Snowflake ID as a string.
     * @returns A unique Snowflake ID as a string.
     */
    generate(): string {
        return this.snowflake.generate();  // Generate and return the ID as a string
    }
}

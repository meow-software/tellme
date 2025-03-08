/**
 * Represents a base entity with creation and update timestamps.
 * This class can be extended to add additional properties and methods.
 */
export abstract class BaseEntity {
    /** The timestamp when the entity was created. */
    createdAt: Date;

    /** The timestamp when the entity was last updated. */
    updatedAt: Date;

    /**
     * Creates an instance of BaseEntity.
     * @param createdAt The creation timestamp. If not provided, the current date will be used.
     * @param updatedAt The update timestamp. If not provided, the current date will be used.
     */
    constructor(createdAt?: Date, updatedAt?: Date) {
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || new Date();
    }

    /**
     * Gets the creation timestamp of the entity.
     * @returns The creation timestamp.
     */
    getCreatedAt(): Date {
        return this.createdAt;
    }

    /**
     * Gets the update timestamp of the entity.
     * @returns The update timestamp.
     */
    getUpdatedAt(): Date {
        return this.createdAt;
    }
}

/**
 * Represents an entity with a unique identifier and creation/update timestamps.
 * This class extends from BaseEntity and adds an `id` property.
 */
export abstract class SnowflakeEntity extends BaseEntity {
    /** The unique identifier of the entity. */
    id: string;

    /**
     * Creates an instance of SnowflakeEntity.
     * @param id The unique identifier for the entity.
     * @param createdAt The creation timestamp. If not provided, the current date will be used.
     * @param updatedAt The update timestamp. If not provided, the current date will be used.
     */
    constructor(id: string, createdAt?: Date, updatedAt?: Date) {
        super(createdAt, updatedAt);
        this.id = id;
    }

    /**
     * Gets Snowflake Id of the entity.
     * @returns The snowflake ID of the entity.
     */
    getId(): string {
        return this.id;
    }
}

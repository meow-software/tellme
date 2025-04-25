/**
 * Represents a base entity with creation and update timestamps.
 * This class can be extended to add additional properties and methods.
 */
export abstract class BaseEntity {
    /** The timestamp when the entity was created. */
    createdAt: Date | undefined;

    /** The timestamp when the entity was last updated. */
    updatedAt: Date | undefined;

    /**
     * Creates an instance of BaseEntity.
     * @param createdAt The creation timestamp. 
     * @param updatedAt The last update timestamp. 
     */
    constructor(createdAt?: Date, updatedAt?: Date) {
        this.createdAt = createdAt;
        this.updatedAt = updatedAt
    }

    /**
     * Gets the creation timestamp of the entity.
     * @returns The creation timestamp.
     */
    getCreatedAt(): Date | undefined{
        return this.createdAt;
    }

    /**
     * Gets the update timestamp of the entity.
     * @returns The last update timestamp.
     */
    getUpdatedAt(): Date | undefined{
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
     * @param createdAt The creation timestamp. 
     * @param updatedAt The last update timestamp. 
     */
    constructor(id: string , createdAt?: Date, updatedAt?: Date) {
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

export interface IRepository<T> {
  create(entity: T): Promise<T>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
}

export abstract class AbstractRepository<T> implements IRepository<T> {
  abstract create(entity: T): Promise<T>;
  abstract update(id: string, entity: Partial<T>): Promise<T>;
  abstract delete(id: string): Promise<boolean>;
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
}

/**
 * BaseModel is a type representing the structure of a model
 * that supports the basic database operations such as:
 * - findUnique
 * - create
 * - update
 * - delete
 * - findMany
 */
export type BaseModel = {
  findUnique: Function;
  create: Function;
  update: Function;
  delete: Function;
  findMany: Function;
};

/**
 * BaseRepository provides basic CRUD operations (Create, Read, Update, Delete) 
 * for any entity that is passed as the generic type T. The repository is
 * initialized with a model that implements the BaseModel type, 
 * which includes methods for interacting with the database.
 * 
 * @typeparam T - The entity type (e.g., User, Product, etc.)
 * @typeparam M - The model type, which extends BaseModel (e.g., Prisma Client model for User)
 */
export class BaseRepository<
  T, // Entity type (e.g., User)
  M extends BaseModel // Model type (e.g., Prisma model)
> extends AbstractRepository<T> implements IRepository<T> {

  /**
   * Creates an instance of BaseRepository with the provided model.
   * 
   * @param model - The model used for performing CRUD operations.
   */
  constructor(protected readonly model: M) {
    super();
  }

  /**
   * Creates a new entity in the database.
   * 
   * @param entity - The entity data to create.
   * @returns The created entity.
   * @throws Will throw an error if the creation fails.
   */
  async create(entity: T): Promise<T> {
    try {
      return await this.model.create({
        data: entity,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error creating entity: ' + error.message);
      }
      throw error;
    }
  }

  /**
   * Updates an existing entity in the database.
   * 
   * @param fields - Fields data to update.
   * @returns The updated entity.
   * @throws Will throw an error if the update fails.
   */
  async update(id: string | BigInt, fields: any): Promise<T> {
    try {
      return await this.model.update({
        where: { id },
        data: {
          ...fields
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error updating entity: ' + error.message);
      }
      throw error;
    }
  }

  /**
   * Deletes an entity from the database by its ID.
   * 
   * @param id - The ID of the entity to delete.
   * @returns True if the deletion was successful, false otherwise.
   * @throws Will throw an error if the deletion fails.
   */
  async delete(id: string | BigInt): Promise<any> {
    // TODO: retourner le mesage supprimer
    try {
      return await this.model.delete({
        where: { id },
      });
      // return true; // Return true if the entity was successfully deleted
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error deleting entity: ' + error.message);
      }
      throw error;
    }
  }

  /**
   * Finds an entity by its ID.
   * 
   * @param id - The ID of the entity to find.
   * @returns The found entity or null if not found.
   * @throws Will throw an error if the find operation fails.
   */
  async findById(id: string | BigInt): Promise<T | null> {
    try {
      return await this.model.findUnique({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error finding entity by ID: ' + error.message);
      }
      throw error;
    }
  }

  /**
   * Finds all entities in the database.
   * 
   * @returns An array of all entities.
   * @throws Will throw an error if the find operation fails.
   */
  async findAll(): Promise<T[]> {
    try {
      return await this.model.findMany();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error finding all entities: ' + error.message);
      }
      throw error;
    }
  }

  /**
 * Finds a unique entity in the database based on the specified criteria.
 *
 * @template T - The type of the returned entity.
 * @param {Object} requests - Object containing selection and search criteria.
 * @param {Object} [requests.select] - Specific fields to select in the entity (optional).
 * @param {Object} requests.where - Search criteria to find a unique entity.
 * @returns {Promise<T | null>} A promise resolving to the found entity or `null` if no match is found.
 * @throws {Error} Throws an error if the query fails.
 *
 * @example
 * // Example usage with Prisma and a User model
 * const user = await userRepository.findUnique({
 *   where: { id: 1 },
 *   select: { id: true, name: true }
 * });
 * console.log(user);
 */
  async findUnique(requests: { select?: any, where: any }): Promise<T | null> {
    try {
      return await this.model.findUnique(requests);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error('Error finding entity by ID: ' + error.message);
      }
      throw error;
    }
  }
}

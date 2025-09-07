import { ResponseFormatter } from "..";


describe('ResponseFormatterService', () => {
    let service: ResponseFormatter;

    beforeEach(() => {
        service = new ResponseFormatter();
    });

    it('should return the same primitive if input is not object/array', () => {
        expect(service.format(42)).toBe(42);
        expect(service.format('hello')).toBe('hello');
        expect(service.format(true)).toBe(true);
        expect(service.format(null)).toBe(null);
    });

    it('should convert bigint properties to string', () => {
        const input = { id: 123n, name: 'Alice' };
        const output = service.format(input);

        expect(output.id).toBe('123'); // bigint converted to string
        expect(output.name).toBe('Alice');
    });

    it('should recursively convert bigints in nested objects', () => {
        const input = { user: { id: 999n, nested: { value: 1234n } } };
        const output = service.format(input);

        expect(output.user.id).toBe('999');
        expect(output.user.nested.value).toBe('1234');
    });

    it('should recursively convert bigints in arrays', () => {
        const input = [{ id: 1n }, { id: 2n }];
        const output = service.format(input);

        expect(output[0].id).toBe('1');
        expect(output[1].id).toBe('2');
    });

    it('should remove keys specified in removeKeys array', () => {
        const input = { id: 123n, secret: 'topsecret', nested: { token: 'abc', value: 456n } };
        const output = service.format(input, ['secret', 'token']);

        expect(output).toEqual({
            id: '123',
            nested: { value: '456' } // 'token' removed
        });
    });

    it('should remove keys in nested objects and arrays', () => {
        const input = [
            { id: 1n, secret: 'x' },
            { id: 2n, secret: 'y', nested: { token: 'abc', value: 3n } }
        ];
        const output = service.format(input, ['secret', 'token']);

        expect(output).toEqual([
            { id: '1' },
            { id: '2', nested: { value: '3' } }
        ]);
    });

    it('should handle empty objects and arrays', () => {
        expect(service.format({})).toEqual({});
        expect(service.format([])).toEqual([]);
    });

    it('should handle mixed types correctly', () => {
        const input = {
            id: 123n,
            name: 'Alice',
            active: true,
            tags: ['a', 'b'],
            nested: [{ big: 999n, remove: 'x' }]
        };
        const output = service.format(input, ['remove']);

        expect(output).toEqual({
            id: '123',
            name: 'Alice',
            active: true,
            tags: ['a', 'b'],
            nested: [{ big: '999' }]
        });
    });
});

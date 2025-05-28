describe('Unit Tests', () => {
  describe('Math Operations', () => {
    it('should add two numbers correctly', () => {
      expect(2 + 3).toBe(5);
    });

    it('should multiply two numbers correctly', () => {
      expect(4 * 5).toBe(20);
    });
  });

  describe('String Operations', () => {
    it('should concatenate strings', () => {
      expect('Hello' + ' ' + 'World').toBe('Hello World');
    });

    it('should check string length', () => {
      expect('Jenkins'.length).toBe(7);
    });
  });

  describe('Array Operations', () => {
    it('should filter array elements', () => {
      const numbers = [1, 2, 3, 4, 5];
      const evenNumbers = numbers.filter(n => n % 2 === 0);
      expect(evenNumbers).toEqual([2, 4]);
    });

    it('should map array elements', () => {
      const numbers = [1, 2, 3];
      const doubled = numbers.map(n => n * 2);
      expect(doubled).toEqual([2, 4, 6]);
    });
  });
});
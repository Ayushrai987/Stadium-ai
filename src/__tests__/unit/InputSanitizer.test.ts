import { describe, it, expect } from 'vitest';
import {
  sanitizeHTML,
  validateStringInput,
  validateNumericInput,
  validateEmail,
  stripHTMLTags,
  containsInjectionPattern,
} from '../../infrastructure/security/InputSanitizer';

describe('Input Sanitization & Validation', () => {
  describe('sanitizeHTML', () => {
    it('should escape dangerous characters to HTML entities', () => {
      expect(sanitizeHTML('<script>')).toBe('&lt;script&gt;');
      expect(sanitizeHTML('"hello"')).toBe('&quot;hello&quot;');
      expect(sanitizeHTML("'world'")).toBe('&#x27;world&#x27;');
      expect(sanitizeHTML('a & b')).toBe('a &amp; b');
      expect(sanitizeHTML('src/main')).toBe('src&#x2F;main');
    });

    it('should handle empty or invalid inputs', () => {
      expect(sanitizeHTML('')).toBe('');
      // @ts-expect-error test non-string input
      expect(sanitizeHTML(null)).toBe('');
    });
  });

  describe('validateStringInput', () => {
    it('should sanitize and return valid string input', () => {
      expect(validateStringInput('  Clean Input  ')).toBe('Clean Input');
      expect(validateStringInput('<div>Dangerous</div>')).toBe('&lt;div&gt;Dangerous&lt;&#x2F;div&gt;');
    });

    it('should reject inputs that exceed maximum length bounds', () => {
      expect(validateStringInput('a'.repeat(20), 10)).toBeNull();
    });

    it('should reject empty or whitespace-only inputs', () => {
      expect(validateStringInput('   ')).toBeNull();
      expect(validateStringInput(123)).toBeNull();
    });
  });

  describe('validateNumericInput', () => {
    it('should accept valid numbers within boundaries', () => {
      expect(validateNumericInput(15, 0, 100)).toBe(15);
      expect(validateNumericInput(0)).toBe(0);
    });

    it('should reject out of boundary numbers or invalid types', () => {
      expect(validateNumericInput(-5, 0)).toBeNull();
      expect(validateNumericInput(150, 0, 100)).toBeNull();
      expect(validateNumericInput(NaN)).toBeNull();
      expect(validateNumericInput(Infinity)).toBeNull();
      expect(validateNumericInput('15')).toBeNull();
    });
  });

  describe('validateEmail', () => {
    it('should validate email format correctness', () => {
      expect(validateEmail('test@stadium.ai')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('stripHTMLTags', () => {
    it('should remove tags leaving only text content', () => {
      expect(stripHTMLTags('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
      expect(stripHTMLTags('plain text')).toBe('plain text');
      // @ts-expect-error test non-string
      expect(stripHTMLTags(undefined)).toBe('');
    });
  });

  describe('containsInjectionPattern', () => {
    it('should flag script, eval, and event handler inline statements', () => {
      expect(containsInjectionPattern('normal text')).toBe(false);
      expect(containsInjectionPattern('<script>alert()</script>')).toBe(true);
      expect(containsInjectionPattern('javascript:void(0)')).toBe(true);
      expect(containsInjectionPattern('eval("alert()")')).toBe(true);
      expect(containsInjectionPattern('onclick="doStuff()"')).toBe(true);
    });
  });
});

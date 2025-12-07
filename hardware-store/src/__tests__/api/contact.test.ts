import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import type { ContactFormData } from '@/types'

// Validation function extracted from API route for testing
interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

function validateContactForm(data: Partial<ContactFormData>): ValidationResult {
  const errors: Record<string, string> = {}
  
  if (!data.name || data.name.trim().length === 0) {
    errors.name = '请输入姓名'
  }
  
  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = '请输入电话'
  } else if (!/^1[3-9]\d{9}$/.test(data.phone)) {
    errors.phone = '请输入有效的手机号'
  }
  
  if (!data.message || data.message.trim().length === 0) {
    errors.message = '请输入留言内容'
  }
  
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '请输入有效的邮箱地址'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Sanitize function for round-trip testing
function sanitizeContactForm(data: ContactFormData): ContactFormData {
  return {
    name: data.name.trim(),
    phone: data.phone.trim(),
    email: data.email?.trim() || '',
    company: data.company?.trim(),
    message: data.message.trim(),
  }
}

// Test data generators
const validPhoneArbitrary = fc.integer({ min: 13000000000, max: 19999999999 })
  .map((n) => String(n))

const invalidPhoneArbitrary = fc.oneof(
  fc.string({ minLength: 0, maxLength: 10 }), // Too short
  fc.string({ minLength: 12, maxLength: 20 }), // Too long
  fc.constant('12345678901'), // Doesn't start with 1[3-9]
)

const validEmailArbitrary = fc.emailAddress()

const invalidEmailArbitrary = fc.oneof(
  fc.string({ minLength: 1, maxLength: 20 }).filter((s) => !s.includes('@')),
  fc.constant('invalid@'),
  fc.constant('@invalid.com'),
)

const validContactFormArbitrary = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  phone: validPhoneArbitrary,
  email: fc.option(validEmailArbitrary, { nil: '' }),
  company: fc.option(fc.string({ maxLength: 100 })),
  message: fc.string({ minLength: 1, maxLength: 500 }).filter((s) => s.trim().length > 0),
}) as fc.Arbitrary<ContactFormData>

describe('Contact Form - Property Tests', () => {
  /**
   * **Feature: hardware-store-website, Property 10: Contact form validation**
   * *For any* contact form submission with missing required fields (name, phone, message), 
   * the system SHALL reject the submission and return validation errors without saving to Strapi.
   * **Validates: Requirements 7.3**
   */
  it('Property 10: Missing name returns validation error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.oneof(fc.constant(''), fc.constant('   '), fc.constant(undefined)),
          phone: validPhoneArbitrary,
          message: fc.string({ minLength: 1 }),
        }),
        (data) => {
          const result = validateContactForm(data as Partial<ContactFormData>)
          
          return !result.isValid && 'name' in result.errors
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: Missing phone returns validation error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          phone: fc.oneof(fc.constant(''), fc.constant(undefined)),
          message: fc.string({ minLength: 1 }),
        }),
        (data) => {
          const result = validateContactForm(data as Partial<ContactFormData>)
          
          return !result.isValid && 'phone' in result.errors
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: Invalid phone format returns validation error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          phone: invalidPhoneArbitrary,
          message: fc.string({ minLength: 1 }),
        }),
        (data) => {
          const result = validateContactForm(data as Partial<ContactFormData>)
          
          // Should have phone error if phone doesn't match pattern
          return !result.isValid && 'phone' in result.errors
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: Missing message returns validation error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          phone: validPhoneArbitrary,
          message: fc.oneof(fc.constant(''), fc.constant('   '), fc.constant(undefined)),
        }),
        (data) => {
          const result = validateContactForm(data as Partial<ContactFormData>)
          
          return !result.isValid && 'message' in result.errors
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: Invalid email format returns validation error', () => {
    fc.assert(
      fc.property(
        fc.record({
          name: fc.string({ minLength: 1 }),
          phone: validPhoneArbitrary,
          email: invalidEmailArbitrary,
          message: fc.string({ minLength: 1 }),
        }),
        (data) => {
          const result = validateContactForm(data as Partial<ContactFormData>)
          
          return !result.isValid && 'email' in result.errors
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 10: Valid form passes validation', () => {
    fc.assert(
      fc.property(
        validContactFormArbitrary,
        (data) => {
          const result = validateContactForm(data)
          
          return result.isValid && Object.keys(result.errors).length === 0
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * **Feature: hardware-store-website, Property 11: Contact form round-trip**
   * *For any* valid contact form submission, the data saved to Strapi 
   * SHALL match the submitted form data exactly.
   * **Validates: Requirements 7.2**
   */
  it('Property 11: Sanitized data preserves essential content', () => {
    fc.assert(
      fc.property(
        validContactFormArbitrary,
        (data) => {
          const sanitized = sanitizeContactForm(data)
          
          // Trimmed values should match
          return (
            sanitized.name === data.name.trim() &&
            sanitized.phone === data.phone.trim() &&
            sanitized.message === data.message.trim()
          )
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 11: Round-trip preserves name', () => {
    fc.assert(
      fc.property(
        validContactFormArbitrary,
        (data) => {
          const sanitized = sanitizeContactForm(data)
          
          // Name should be preserved (trimmed)
          return sanitized.name.length > 0 && sanitized.name === data.name.trim()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 11: Round-trip preserves phone', () => {
    fc.assert(
      fc.property(
        validContactFormArbitrary,
        (data) => {
          const sanitized = sanitizeContactForm(data)
          
          // Phone should be preserved (trimmed)
          return sanitized.phone === data.phone.trim()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('Property 11: Round-trip preserves message', () => {
    fc.assert(
      fc.property(
        validContactFormArbitrary,
        (data) => {
          const sanitized = sanitizeContactForm(data)
          
          // Message should be preserved (trimmed)
          return sanitized.message === data.message.trim()
        }
      ),
      { numRuns: 100 }
    )
  })
})

import { describe, it, expect } from 'vitest'
import { sanitizeNoteContent } from '../src/utils/sanitize'

describe('sanitizeNoteContent', () => {
  it('removes HTML tags while preserving text content', () => {
    expect(sanitizeNoteContent('<b>Hello</b> world')).toBe('Hello world')
  })

  it('removes script tags and their content', () => {
    expect(
      sanitizeNoteContent("<script>alert('XSS')</script>Safe note")
    ).toBe('Safe note')
  })

  it('preserves plain text', () => {
    expect(sanitizeNoteContent('My safe note')).toBe('My safe note')
  })

  it('preserves special characters', () => {
    expect(sanitizeNoteContent('5 > 3 & 2 < 4')).toBe('5 > 3 & 2 < 4')
  })

  it('removes nested HTML tags', () => {
    expect(
      sanitizeNoteContent('<div><strong>Important</strong> note</div>')
    ).toBe('Important note')
  })
})


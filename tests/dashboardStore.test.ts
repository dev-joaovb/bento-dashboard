import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore } from '../src/store/dashboardStore'

describe('dashboardStore note sanitization', () => {
  beforeEach(() => {
    useDashboardStore.setState({
      notes: [],
    })
  })

  it('sanitizes HTML when adding a note', () => {
    useDashboardStore
      .getState()
      .addNote("<script>alert('XSS')</script><b>Safe note</b>", '#fef3c7')

    const notes = useDashboardStore.getState().notes

    expect(notes).toHaveLength(1)
    expect(notes[0].content).toBe('Safe note')
  })

  it('sanitizes HTML when updating a note', () => {
    useDashboardStore
      .getState()
      .addNote('Original note', '#fef3c7')

    const noteId = useDashboardStore.getState().notes[0].id

    useDashboardStore
      .getState()
      .updateNote(noteId, "<img src=x onerror=alert('XSS')>Updated note")

    const notes = useDashboardStore.getState().notes

    expect(notes[0].content).toBe('Updated note')
  })

  it('does not store a note that becomes empty after sanitization', () => {
    useDashboardStore
      .getState()
      .addNote("<script>alert('XSS')</script>", '#fef3c7')

    expect(useDashboardStore.getState().notes).toHaveLength(0)
  })
})
export function sanitizeNoteContent(content: string): string {
  const document = new DOMParser().parseFromString(content, 'text/html')
  return document.body.textContent ?? ''
}
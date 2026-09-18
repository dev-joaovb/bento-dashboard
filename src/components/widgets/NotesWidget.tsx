import { useState } from 'react'
import { useDashboardStore } from '../../store/dashboardStore'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'

// Note colors remain in JavaScript because they are stored with each note
// and applied dynamically through the backgroundColor style property.
const NOTE_COLORS = [
  '#fef3c7',
  '#fce7f3',
  '#dbeafe',
  '#d1fae5',
  '#e0e7ff',
  '#fef9c3',
]

export function NotesWidget() {
  const { notes, addNote, updateNote, deleteNote } = useDashboardStore()
  const [newNoteContent, setNewNoteContent] = useState('')
  const [selectedColor, setSelectedColor] = useState(NOTE_COLORS[0])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  const handleAddNote = () => {
    if (!newNoteContent.trim()) return
    
    addNote(newNoteContent.trim(), selectedColor)
    setNewNoteContent('')
    setSelectedColor(NOTE_COLORS[0])
    setIsAddingNote(false)
  }

  const handleStartEdit = (id: string, content: string) => {
    setEditingId(id)
    setEditContent(content)
  }

  const handleSaveEdit = () => {
    if (!editingId || !editContent.trim()) return
    
    updateNote(editingId, editContent.trim())
    setEditingId(null)
    setEditContent('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditContent('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAddNote()
    }
    if (e.key === 'Escape') {
      handleCancelEdit()
      setIsAddingNote(false)
    }
  }

  return (
    <div className="widget-card p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Sticky Notes</h2>
        <button
          onClick={() => setIsAddingNote(true)}
          className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
          aria-label="Add new note"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {isAddingNote && (
        <div className="mb-4 p-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your note..."
            className="w-full p-2 bg-transparent border-none outline-none resize-none text-sm"
            rows={3}
            autoFocus
          />
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1">
              {NOTE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-5 h-5 rounded-full border-2 ${
                    selectedColor === color 
                      ? 'border-primary-500' 
                      : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingNote(false)}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newNoteContent.trim()}
                className="btn-primary text-xs disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] text-sm py-8">
            No notes yet. Click + to add one!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-lg relative group"
              style={{ backgroundColor: note.color }}
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-1 bg-transparent border-none outline-none resize-none text-sm"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={handleSaveEdit}
                      className="note-action p-1 rounded"
                      aria-label="Save edit"
                    >
                      <Check className="w-4 h-4" style={{ color: 'var(--success-color)' }} />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="note-action p-1 rounded"
                      aria-label="Cancel edit"
                    >
                      <X className="w-4 h-4" style={{ color: 'var(--error-color)' }} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => handleStartEdit(note.id, note.content)}
                      className="note-action p-1 rounded"
                      aria-label="Edit note"
                    >
                      <Edit2 className="w-3 h-3 text-[var(--text-secondary)]" />
                    </button>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="note-action p-1 rounded"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3 h-3 text-[var(--error-color)]" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

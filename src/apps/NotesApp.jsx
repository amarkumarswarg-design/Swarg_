import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, Edit } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const NotesApp = () => {
  const [notes, setNotes] = useLocalStorage('ios-notes', []);
  const [currentNote, setCurrentNote] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [title, setTitle] = useState('');

  const saveNote = () => {
    if (currentNote.trim()) {
      if (editingIndex !== null) {
        const updatedNotes = [...notes];
        updatedNotes[editingIndex] = { 
          title: title || 'Untitled', 
          content: currentNote,
          date: new Date().toLocaleDateString()
        };
        setNotes(updatedNotes);
        setEditingIndex(null);
      } else {
        setNotes([
          ...notes,
          { 
            title: title || 'Untitled', 
            content: currentNote,
            date: new Date().toLocaleDateString()
          }
        ]);
      }
      setCurrentNote('');
      setTitle('');
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const editNote = (index) => {
    setCurrentNote(notes[index].content);
    setTitle(notes[index].title);
    setEditingIndex(index);
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800">Notes</h1>
      </div>

      <div className="p-4">
        {/* Input Form */}
        <div className="mb-6 bg-white rounded-xl shadow-md p-4">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-2 border-b text-lg font-semibold focus:outline-none"
          />
          <textarea
            placeholder="Start typing..."
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            className="w-full h-40 p-2 resize-none focus:outline-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => {
                setCurrentNote('');
                setTitle('');
                setEditingIndex(null);
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              {editingIndex !== null ? 'Update' : 'Save'}
            </button>
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No notes yet</p>
              <p className="text-sm mt-2">Create your first note above</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">{note.title}</h3>
                    <p className="text-xs text-gray-500">{note.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editNote(index)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => deleteNote(index)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {note.content.length > 150
                    ? `${note.content.substring(0, 150)}...`
                    : note.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotesApp;

import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';

const NotesApp = () => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState('');
  const [title, setTitle] = useState('');

  const saveNote = () => {
    if (currentNote.trim()) {
      setNotes([
        ...notes,
        { 
          title: title || 'Untitled', 
          content: currentNote,
          date: new Date().toLocaleDateString()
        }
      ]);
      setCurrentNote('');
      setTitle('');
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="sticky top-0 bg-white border-b px-4 py-3">
        <h1 className="text-xl font-bold text-gray-800">Notes</h1>
      </div>

      <div className="p-4">
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
          <button
            onClick={saveNote}
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Note
          </button>
        </div>

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
                  <button
                    onClick={() => deleteNote(index)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {note.content}
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

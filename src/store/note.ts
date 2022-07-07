import {makeAutoObservable} from "mobx";
import {v1} from "uuid";
import {noteAPI} from "../api/api";
import {AxiosError} from "axios";
import {DataType, NoteType, TagType} from "./types";

class Note {
    noteState = {
        notes: [] as Array<NoteType>,
        currentNotes: [] as Array<NoteType>
    } as DataType

    constructor() {
        makeAutoObservable(this)
    }

    addTags(title: string, noteId: string, tags: TagType) {
        this.noteState.notes = this.noteState.notes.map(nt => nt.id === noteId ? {...nt, tags: [tags]} : nt)
    }

    addNote(title: string) {
        this.noteState.notes.push({id: v1(), title: title, tags: []})
    }

    removeNote(id: string) {
        this.noteState.notes = this.noteState.notes.filter(n => n.id !== id)
        this.pushNote()
    }

    setNote(notes: Array<NoteType>) {
        this.noteState.notes = notes
    }

    pushAllNotes(notes: Array<NoteType>) {
        this.noteState.notes = notes
    }

    changeNote(id: string, title: string) {
        this.noteState.notes = this.noteState.notes.map(nt => nt.id === id ? {...nt, title: title} : nt)
    }

    searchNote(titleFilter: string) {
        let currentTags: any = []
        let currentTag = titleFilter
        this.noteState.notes.forEach(function (e) {
            currentTags = currentTags.concat(e.tags
                .filter(c => c.title.split(' ').find(t => t === currentTag)))
        })
        let currentNote = this.noteState.notes.filter(c => c.title.split(' ')
            .find(t => t === currentTag))

        this.noteState.currentNotes = currentNote
        this.pushNote()
    }

    //requests
    pushNote(){
        const notesFromState = this.noteState.notes
        noteAPI.pushNotes(notesFromState)
            .then(() => {
                this.pushAllNotes(notesFromState)
            })
            .catch((err: AxiosError) => {
                console.log(err.message)
            })
    }

    fetchNote() {
        noteAPI.getNotes()
            .then((res) => {
                this.setNote(res.data.notes)
            })
            .catch((err: AxiosError) => {
                console.log(err.message)
            })
    }
}

export default new Note();
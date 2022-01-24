import {v1} from "uuid";
import {Dispatch} from "redux";
import {noteAPI} from "../api/api";
import {AppRootType} from "./store";
import {AxiosError} from "axios";

const ADD_NOTE = 'note/ADD_NOTE'
const REMOVE_NOTE = 'note/REMOVE_NOTE'
const SET_NOTE = 'note/SET_NOTE'
const PUSH_NOTES = 'note/PUSH_NOTES'
const CHANGE_NOTE = 'note/CHANGE_NOTE'
const ADD_TAGS = 'note/ADD_TAGS'
const SEARCH_NOTE = 'note/SEARCH_NOTE'

const initialState = {
    notes: [] as Array<NoteType>,
    currentNotes: [] as Array<NoteType>
} as DataType

export const noteReducer = (state: DataType = initialState, action: ActionTypes): DataType => {
    switch (action.type) {
        case ADD_NOTE:
            return {
                ...state,
                notes: [...state.notes, {id: v1(), title: action.title, tags: []}]
            }

        case ADD_TAGS:
            return {
                ...state,
                notes: state.notes
                    .map(nt => nt.id === action.noteId ? {...nt, tags: [action.tags]} : nt)
            }

        case REMOVE_NOTE:
            return {...state, notes: state.notes.filter(n => n.id !== action.id)}

        case SET_NOTE:
            return {...state, notes: action.notes}

        case PUSH_NOTES:
            return {...state, notes: action.notes}

        case CHANGE_NOTE:
            return {
                ...state,
                notes: state.notes.map(nt => nt.id === action.id ? {...nt, title: action.title} : nt)
            }

        case SEARCH_NOTE:
            let currentTags: any = []
            let currentTag = action.titleFilter
            state.notes.forEach(function (e) {
                currentTags = currentTags.concat(e.tags
                    .filter(c => c.title.split(' ').find(t => t === currentTag)))
            })
            let currentNote = state.notes.filter(c => c.title.split(' ').find(t => t === currentTag))
            return {
                ...state, currentNotes: currentNote
            }

        default:
            return state
    }
}

//action
export const addTagsAC = (title: string, noteId: string, tags: TagType) => ({
    type: ADD_TAGS,
    title,
    tags,
    noteId
} as const)

export const addNoteAC = (title: string) => ({
    type: ADD_NOTE,
    title
} as const)

export const removeNoteAC = (id: string) => ({
    type: REMOVE_NOTE,
    id
} as const)

export const setNoteAC = (notes: Array<NoteType>) => ({
    type: SET_NOTE,
    notes
} as const)

export const pushAllNotesAC = (notes: Array<NoteType>) => ({
    type: PUSH_NOTES,
    notes
} as const)

export const changeNoteAC = (id: string, title: string) => ({
    type: CHANGE_NOTE,
    id,
    title
} as const)

export const searchNoteAC = (titleFilter: string) => ({
    type: SEARCH_NOTE,
    titleFilter,
} as const)

//thunk
export const pushNoteTC = () => (dispatch: Dispatch<any>, getState: () => AppRootType) => {
    const notesFromState = getState().note.notes
    noteAPI.pushNotes(notesFromState)
        .then(() => {
            dispatch(pushAllNotesAC(notesFromState))
        })
        .catch((err: AxiosError) => {
            console.log(err.message)
        })
}

export const fetchNoteTC = () => (dispatch: Dispatch<any>) => {
    noteAPI.getNotes()
        .then((res) => {
            dispatch(setNoteAC(res.data.notes))
        })
        .catch((err: AxiosError) => {
            console.log(err.message)
        })
}

//types
export type DataType = {
    notes: Array<NoteType>
    currentNotes: Array<NoteType>
}

export type TagType = {
    id: string
    title: string
    noteId: string
}

export type NoteType = {
    id: string
    title: string
    tags: Array<TagType>
}

type ActionTypes = ReturnType<typeof addNoteAC>
    | ReturnType<typeof removeNoteAC>
    | ReturnType<typeof setNoteAC>
    | ReturnType<typeof pushAllNotesAC>
    | ReturnType<typeof changeNoteAC>
    | ReturnType<typeof addTagsAC>
    | ReturnType<typeof searchNoteAC>

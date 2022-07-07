import React, {ChangeEvent, useEffect, useState} from "react";
import s from './NoteList.module.scss'
import SuperInputText from "../../common/castomInput/SuperInputText";
import SuperButton from "../../common/castomButton/SuperButton";
import {Note} from "../Note/Note";
import {observer} from "mobx-react-lite";
import note from '../../store/note'
import {TagType} from "../../store/types";

export const NoteList = observer(() => {
    const [title, setTitle] = useState<string>('')
    const [filter, setFilter] = useState<boolean>(false)
    const [filterTitle, setFilterTitle] = useState<string>('')

    useEffect(() => {
        note.fetchNote()
    }, [])


    const onChangeFilterHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterTitle(event.currentTarget.value)
    }

    const filterNotes = () => {
        note.searchNote(filterTitle)
        setFilter(true)
    }

    const filterOff = () => {
        setFilter(false)
    }

    const addNoteOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    const addNote = () => {
        note.addNote(title)
        note.pushNote()
        setTitle('')
    }

    const removeNote = (id: string) => {
        note.removeNote(id)
    }

    const changeNoteCallback = (id: string, title: string) => {
        let valueTitle = title.split(' ')
        let hashTagArr = valueTitle.filter(t => t[0] === '#')
        let hashTag = hashTagArr.join(' ')

        const tag: TagType = {
            id,
            title: hashTag,
            noteId: id
        }

        note.addTags(hashTag, id, tag)
        note.changeNote(id, title)
        note.pushNote()
    }

    return (
        <div className={s.noteList}>

            <div className={s.fieldBlock}>

                <SuperInputText placeholder={'Add note'} onChange={addNoteOnChangeHandler} value={title}/>
                <SuperButton onClick={addNote} disabled={title.length === 0}>add note</SuperButton>


                <SuperInputText
                    onChange={onChangeFilterHandler}
                    value={filterTitle}
                    placeholder={'Search to hashtag'}/>
                <div className={s.filterButtons}>
                    <SuperButton onClick={filterNotes} disabled={filterTitle.length === 0}>filter</SuperButton>
                    <SuperButton onClick={filterOff}>all</SuperButton>
                </div>

            </div>

            <div className={s.noteBlock}>
                {
                    !filter && note.noteState.notes.map(el => {
                            return <Note key={el.id}
                                         id={el.id}
                                         title={el.title}
                                         tags={el.tags}
                                         removeNoteCallback={removeNote}
                                         changeNoteCallback={changeNoteCallback}/>
                        }
                    )
                }
                {
                    filter && note.noteState.currentNotes.map(el => {
                            return <Note key={el.id}
                                         id={el.id}
                                         title={el.title}
                                         tags={el.tags}
                                         removeNoteCallback={removeNote}
                                         changeNoteCallback={changeNoteCallback}/>
                        }
                    )
                }
            </div>
        </div>
    );
})
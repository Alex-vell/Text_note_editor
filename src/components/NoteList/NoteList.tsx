import React, {ChangeEvent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    addNoteAC,
    addTagsAC,
    changeNoteAC,
    fetchNoteTC,
    NoteType,
    pushNoteTC,
    removeNoteAC,
    searchNoteAC, TagType
} from "../../redux/note-reducer";
import {AppRootType} from "../../redux/store";
import s from './NoteList.module.scss'
import SuperInputText from "../../common/castomInput/SuperInputText";
import SuperButton from "../../common/castomButton/SuperButton";
import {Note} from "../Note/Note";

export const NoteList = () => {
    const notes = useSelector<AppRootType, Array<NoteType>>(state => state.note.notes)
    const currentNotes = useSelector<AppRootType, Array<NoteType>>(state => state.note.currentNotes)
    const dispatch = useDispatch()
    const [title, setTitle] = useState<string>('')
    const [filter, setFilter] = useState<boolean>(false)
    const [filterTitle, setFilterTitle] = useState<string>('')

    useEffect(() => {
        dispatch(fetchNoteTC())
    }, [dispatch])


    const onChangeFilterHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setFilterTitle(event.currentTarget.value)
    }

    const filterNotes = () => {
        dispatch(searchNoteAC(filterTitle))
        dispatch(pushNoteTC())
        setFilter(true)
    }

    const filterOff = () => {
        setFilter(false)
    }

    const addNoteOnChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value)
    }

    const addNote = () => {
        dispatch(addNoteAC(title))
        dispatch(pushNoteTC())
        setTitle('')
    }

    const removeNote = (id: string) => {
        dispatch(removeNoteAC(id))
        dispatch(pushNoteTC())
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

        dispatch(addTagsAC(hashTag, id, tag))
        dispatch(changeNoteAC(id, title))
        dispatch(pushNoteTC())
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
                    !filter && notes.map(el => {
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
                    filter && currentNotes.map(el => {
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
}
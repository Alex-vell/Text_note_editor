import React from "react";
import s from "../NoteList/NoteList.module.scss";
import SuperEditableSpan from "../../common/editSpan/SuperEditableSpan";
import {TagType} from "../../redux/note-reducer";

type NoteType = {
    id: string
    title: string
    tags: Array<TagType>
    removeNoteCallback: (id: string) => void
    changeNoteCallback: (id: string, title: string, tags: TagType) => void
}

export const Note: React.FC<NoteType> = (
    {id, title, tags, removeNoteCallback, changeNoteCallback}) => {

    const tag: TagType = {
        id,
        title,
        noteId: id
    }

    return (
        <div className={s.note} key={id}>
            <div className={s.fieldContainer}>
                <div className={s.editSpan}>
                    <SuperEditableSpan tag={tag} id={id} value={title} onChangeText={changeNoteCallback}/>
                </div>
                <button className={s.btnRemove} onClick={() => removeNoteCallback(id)}>x</button>
            </div>
            <div className={s.tags}>
                {
                    tags.map(tg => <div className={s.tag} key={tg.id}>{tg.title}</div>)
                }
            </div>
        </div>
    )
}
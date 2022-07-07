import React, {ChangeEvent, DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes, useState} from 'react'
import styles from './SuperEditableSpan.module.css'
import SuperInputText from "../castomInput/SuperInputText";
import {TagType} from "../../store/types";


// default input prop type
type DefaultInputPropsType = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
// default span prop type
type DefaultSpanPropsType = DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>

type SuperEditableSpanType = DefaultInputPropsType & {
    tag: TagType
    onChangeText: (id: string, value: string, tags:TagType) => void
    onEnter?: () => void
    error?: string
    spanClassName?: string
    value: string
    id: string
    spanProps?: DefaultSpanPropsType
}

const SuperEditableSpan: React.FC<SuperEditableSpanType> = (
    {
        autoFocus,
        onBlur,
        onEnter,
        spanProps,
        onChangeText,
        value,
        id,
        tag,

        ...restProps
    }
) => {
    const [editMode, setEditMode] = useState<boolean>(false)
    let [title, setTitle] = useState(value);
    const {children, onDoubleClick, className, ...restSpanProps} = spanProps || {}

    const onEnterCallback = () => {
        onChangeText(id, title, tag)
        setEditMode(false)

        onEnter && onEnter()
    }
    const onBlurCallback = (e: React.FocusEvent<HTMLInputElement>) => {
        onChangeText(id, title, tag)
        setEditMode(false)

        onBlur && onBlur(e)
    }
    const onDoubleClickCallBack = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        setEditMode(true)

        onDoubleClick && onDoubleClick(e)

    }
    const onChangeTextHandler = (e: ChangeEvent<HTMLInputElement>) => {
        let currentValue = e.currentTarget.value
        setTitle(e.currentTarget.value)
    }

    const spanClassName = `${styles.span} ${className ? className : ''}`

    return (
        <>
            {editMode
                ? (
                    <SuperInputText
                        autoFocus
                        onBlur={onBlurCallback}
                        onEnter={onEnterCallback}
                        onChange={onChangeTextHandler}
                        defaultValue={title}
                        {...restProps}
                    />
                ) : (
                    <span
                        onDoubleClick={onDoubleClickCallBack}
                        className={spanClassName}

                        {...restSpanProps}
                    >
                        ✎ {children || title}
                    </span>
                )
            }
        </>
    )
}

export default SuperEditableSpan

import React from 'react';
import s from './App.module.scss';
import {NoteList} from "./components/NoteList/NoteList";

const App = () => {

  return (
    <div className={s.App}>
        <NoteList/>
    </div>
  );
}

export default App

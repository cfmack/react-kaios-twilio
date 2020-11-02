import React from 'react';
import css from './Conversations.module.css';

export const Conversations = ({ conversations }) => {
  if (conversations === undefined || !conversations.length) return null;

  return (
    <div className={css.conversations}>
      {conversations.map((conversations, index) => (
        <span
          nav-selectable="true"
          key={index}
          className={`${css.conversations} ${conversations.completed ? css.completed : ''}`}>
          {conversations.name}
        </span>
      ))}
    </div>
  )
}


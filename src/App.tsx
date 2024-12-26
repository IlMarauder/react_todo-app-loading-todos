import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './Components/Footer';
import { TodoHeader } from './Components/Header';
import { TodoMain } from './Components/Main';
import { ErrorNotifications } from './Components/Errors';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos()
      .then(todosFromServer => setTodos(todosFromServer))
      .catch(err => {
        setErrorMessage('Unable to load todos');
        throw err;
      });
  }, []);

  const filterTodos = (list: Todo[], filterWord: string) => {
    switch (filterWord) {
      case 'all':
        return list;
      case 'active':
        return list.filter(todo => !todo.completed);
      case 'completed':
        return list.filter(todo => todo.completed);
      default:
        return list;
    }
  };

  const viewedTodos = filterTodos(todos, filter);
  const todosQuantity = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        <section className="todoapp__main" data-cy="TodoList">
          {/* This is a completed todo */}
          {viewedTodos.map(todo => (
            <TodoMain todo={todo} key={todo.id} />
          ))}
        </section>

        {todos.length !== 0 && (
          <TodoFooter
            todosQuantity={todosQuantity}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotifications error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};

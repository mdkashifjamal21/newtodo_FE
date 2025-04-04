// MainTodo.jsx  

import { useState, useEffect } from 'react';  
import { useDispatch, useSelector } from 'react-redux';  
import { googleLogout } from '@react-oauth/google';   
import { clearUser } from '../store/userSlice'; // Import the clearUser action  
import "./MainTodo.css";  

function MainTodo() {  
    const dispatch = useDispatch();  
    const user = useSelector((state) => state.user); // Get user data from Redux  
    const username = useSelector((state) => state.inputUser.name);


    const [todos, setTodos] = useState([]);  
    const [inputValue, setInputValue] = useState("");  
    const [editTodoId, setEditTodoId] = useState(null);  
    const [isLoading, setIsLoading] = useState(false);  
    const [error, setError] = useState(null);  

    const handleLogout = () => {  
      googleLogout(); // Here is where we call the googleLogout function  
      dispatch(clearUser()); // Clear user data in Redux  
      console.log('Logout Success!');  
    };  
     
   console.log(username);
    useEffect(() => {  
      fetchTodos();  
    }, []);  
  
    const fetchTodos = async () => {  
      setIsLoading(true);  
      setError(null);  
      try {  
        const response = await fetch("http://localhost:7000/v1/getTasks");  
        if (!response.ok) throw new Error('Failed to fetch tasks');  
        
        const data = await response.json();  
        console.log(data);  
        setTodos(data);  
      } catch (error) {  
        console.log(error);  
        setError('Failed to load todos. Please try again later.');  
      } finally {  
        setIsLoading(false);  
      }  
    };  
  
    const postTodo = async () => {  
      if (!inputValue.trim()) return;  
  
      setIsLoading(true);  
      setError(null);  
      try {  
        const response = await fetch("http://localhost:7000/v1/postTasks", {  
          method: "POST",  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify(  
            {   
              todo: inputValue ,  
              date: new Date().toISOString(),  
              isloggedIn: true, // update accordingly  
              userExist: username ? true : false, // update accordingly  
              name: user?.name,// Use user's name if available  
              email: user?.email  // Use user's email if available  
            }  
          )  
        });  
  
        if (response.ok) {  
          setInputValue("");  
          await fetchTodos();  
        } else {  
          setError('Error adding todo. Please try again.');  
          console.log('Error posting todo:', response.status);  
        }  
      } catch (err) {  
        console.log(err);  
        setError('Error adding todo. Please try again.');  
      } finally {  
        setIsLoading(false);  
      }  
    };  
  
    const updateTodo = async (id) => {  
      if (!inputValue.trim()) return;  
  
      setIsLoading(true);  
      setError(null);  
      try {  
        const response = await fetch(`http://localhost:7000/v1/updateTask/${id}`, {  
          method: "PUT",  
          headers: { 'Content-Type': 'application/json' },  
          body: JSON.stringify({ todo: inputValue })  
        });  
  
        if (response.ok) {   
          setInputValue("");   
          setEditTodoId(null);  
          await fetchTodos();  
        } else {  
          setError('Error updating todo. Please try again.');  
        }  
      } catch (err) {  
        console.log(err);  
        setError('Error updating todo. Please try again.');  
      } finally {  
        setIsLoading(false);  
      }  
    };  
  
    const deleteTodo = async (id) => {  
      setIsLoading(true);  
      setError(null);  
      try {  
        const response = await fetch(`http://localhost:7000/v1/deleteTask/${id}`, {  
          method: "DELETE",  
        });  
  
        if (response.ok) {  
          await fetchTodos();  
        } else {  
          setError('Error deleting todo. Please try again.');  
        }  
      } catch (err) {  
        console.log(err);  
        setError('Error deleting todo. Please try again.');  
      } finally {  
        setIsLoading(false);  
      }  
    };  
  
    const handleEditClick = (item) => {  
      setInputValue(item.todo);  
      setEditTodoId(item._id);  
    };  
  
    const handleKeyDown = (e) => {  
      if (e.key === 'Enter') {  
        editTodoId ? updateTodo(editTodoId) : postTodo();  
      }  
    };  
  
    const cancelEdit = () => {  
      setInputValue("");  
      setEditTodoId(null);  
    };  
    
    return (  
        <div className="todo-app">  
          <div className="todo-container">  
            <h1 className="app-title">Todo List</h1>  
            
     
            <div className="input-section">  
              <input   
                type="text"   
                value={inputValue}   
                onChange={(e) => setInputValue(e.target.value)}  
                onKeyDown={handleKeyDown}  
                placeholder="What needs to be done?"  
                className="todo-input"  
              />  
              <div className="button-group">  
                <button   
                  className={`action-button ${editTodoId ? 'update-button' : 'add-button'}`}  
                  onClick={editTodoId ? () => updateTodo(editTodoId) : postTodo}  
                  disabled={isLoading}  
                >  
                  {editTodoId ? "Update" : "Add"}  
                </button>  
                {editTodoId && (  
                  <button   
                    className="action-button cancel-button"  
                    onClick={cancelEdit}  
                    disabled={isLoading}  
                  >  
                    Cancel  
                  </button>  
                )}  
              </div>  
            </div>  
            
            {error && <div className="error-message">{error}</div>}  
            
            {isLoading && <div className="loading-spinner">Loading...</div>}  
            
            <div className="todos-section">  
              {todos.length === 0 && !isLoading ? (  
                <div className="empty-state">No todos yet. Add one above!</div>  
              ) : (  
                <ul className="todo-list">  
                  {todos.map((item) => (  
                    <li key={item._id} className={`todo-item ${editTodoId === item._id ? 'editing' : ''}`}>  
                      <span className="todo-text">{item.todo}</span>  
                      <div className="todo-actions">  
                        <button   
                          className="icon-button edit-button"   
                          onClick={() => handleEditClick(item)}  
                          disabled={isLoading}  
                          aria-label="Edit todo"  
                        >  
                          ✏️  
                        </button>  
                        <button   
                          className="icon-button delete-button"   
                          onClick={() => deleteTodo(item._id)}  
                          disabled={isLoading}  
                          aria-label="Delete todo"  
                        >  
                          🗑️  
                        </button>  
                      </div>  
                    </li>  
                  ))}  
                </ul>  
              )}  
            </div>  
            
            {todos.length > 0 && (  
              <div className="todo-stats">  
                {todos.length} {todos.length === 1 ? 'item' : 'items'}  
              </div>  
            )}  
          </div>  
          {user &&(  
              <div className="user-info">  
                <button onClick={handleLogout} className="logout-button">Logout</button>
                 
              </div>  
            ) }  

        </div>  
    );  
}  

export default MainTodo;  
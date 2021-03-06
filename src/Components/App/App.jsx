import React, { Component } from 'react';
import shortid from 'shortid';
import FormFn from '../Input';
import Filter from '../Filter';
import ContactList from '../ContactList';
import styles from './App.module.css';
import PropTypes from 'prop-types';

class App extends Component {
  static defaultProps = {
    contacts: [
      { id: 'id-1', name: 'Rosie Simpson', number: '459-12-56' },
      { id: 'id-2', name: 'Hermione Kline', number: '443-89-12' },
      { id: 'id-3', name: 'Eden Clements', number: '645-17-79' },
      { id: 'id-4', name: 'Annie Copeland', number: '227-91-26' },
    ],
  };

  static propTypes = {
    contacts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        number: PropTypes.string,
      }),
    ),
  };

  state = {
    contacts: [...this.props.contacts],
    filter: '',
    name: '',
    number: '',
  };

  componentDidMount() {
    const localInfo = localStorage.getItem('contacts');
    const parseContacts = JSON.parse(localInfo);
    if (parseContacts) {
      this.setState({ contacts: parseContacts });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts.length !== prevState.contacts.length) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    const { name, number, contacts } = this.state;
    const uniqCheck = contacts.some(item => item.name === name);
    if (uniqCheck) {
      alert(`Імя ${name} вже існує!`);
      return;
    }
    const contact = {
      id: shortid.generate(),
      name: name,
      number: number,
    };
    this.setState(prevState => {
      return { contacts: [contact, ...prevState.contacts] };
    });
    this.resetInput();
  };

  resetInput = () => {
    this.setState({ name: '', number: '' });
  };
  handleInput = e => {
    const { name, value } = e.currentTarget;
    this.setState({ [name]: value });
  };

  onDelete = e => {
    const arr = this.state.contacts.filter(
      contact => contact.id !== e.target.id,
    );
    this.setState({ contacts: [...arr] });
  };

  render() {
    const { handleSubmit, handleInput, onDelete } = this;
    const { name, number, filter, contacts } = this.state;

    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Phonebook</h1>
        <FormFn
          handleSubmit={handleSubmit}
          handleInput={handleInput}
          value={name}
          number={number}
        />
        <h2 className={styles.title2}>Contacts</h2>
        <Filter fiter={filter} handleInput={handleInput} />
        <ContactList contacts={contacts} filter={filter} onDelete={onDelete} />
      </div>
    );
  }
}
export default App;

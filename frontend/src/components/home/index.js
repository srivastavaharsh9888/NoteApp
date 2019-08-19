import React, { Component } from 'react';
import './index.css';
import Nav from './header/Nav';
import List from './NoteList/List';
import Note from './Note';
import axios from 'axios';
import urlFor from './../../helpers/urlFor';
import Flash from './../../lib/Flash';

axios.interceptors.request.use((config) => {
 let token=window.localStorage.getItem("token")
  if (token) {
    config.headers['authorization'] = 'Token ' + token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      showNote: false,
      notes: [],
      note: {},
      newTag: false,
      newEdit:false,
      error: ''
    };
  }

  toggleNote = () => {
    this.setState({
      showNote: ! this.state.showNote,
      note: {}
    })
  }

  getNotes = () => {
    axios.get(urlFor('ListCreateNote/'))
    .then((res) =>  this.setState({notes: res.data}))
    .catch((err) => console.log(err.response.data) );
  }

  getNote = (id) => {
    axios.get(urlFor(`NoteOperation/${id}/`))
    .then((res) => this.setState({note: res.data, showNote: true }) )
    .catch((err) => this.setState({"error":"You don't have edit permissions."}) );
  }

  performSubmissionRequest = (data, id) => {
    if (id) {
      return axios.patch(urlFor(`NoteOperation/${id}/`), data);
    } else {
      return axios.post(urlFor('ListCreateNote/'), data);
    }
  }

  submitNote = (data, id) => {
    this.performSubmissionRequest(data, id)
    .then((res) => this.setState({ showNote: false }) )
    .catch((err) => {
      const { errors } = err.response.data;
      if (errors.content) {
        this.setState({ error: "Missing Note Content!" });
      } else if (errors.title) {
        this.setState({ error: "Missing Note Title!" });
      }
    });
  }

  deleteNote = (id) => {
    const newNotesState = this.state.notes.filter((note) => note.id !== id );
    axios.delete(urlFor(`NoteOperation/${id}/`) )
    .then((res) => this.setState({ notes: newNotesState }) )
    .catch((err) => console.log(err.response.data) );
  }

  showTagForm = () => {
    this.setState({ newTag: true });
  }
  showEditForm = () => {
    this.setState({ newEdit: true });
  }
  closeTagForm = () => {
    this.setState({ newTag: false });
  }
  closeEditForm = () => {
    this.setState({ newEdit: false });
  }
  
  addViewPermission = (data, noteId) => {
    axios.put(urlFor(`ManageAddPermissionView/${noteId}/`), data)
    .then((res) => this.getNote(noteId) )
    .catch((err) => {
      const { errors } = err.response.data;
      if (errors.name) {
        this.setState({ error: "Missing Tag Name!" })
      } else if (errors.title) {

      }
    });
  }

  removeViewPermission = (noteId, id) => {
    axios.put(urlFor(`RemovemManagePermissionUser/${noteId}/`),{userId:id})
    .then((res) => this.getNote(noteId) )
    .catch((err) => console.log(err.response.body))
  }

  addEditPermission = (data, noteId) => {
    axios.patch(urlFor(`ManageAddPermissionView/${noteId}/`), data)
    .then((res) => this.getNote(noteId) )
    .catch((err) => {
      const { errors } = err.response.data;
      if (errors.name) {
        this.setState({ error: "Missing Tag Name!" })
      } else if (errors.title) {
      }
    });
  }

  removeEditPermission = (noteId, id) => {
    axios.patch(urlFor(`RemovemManagePermissionUser/${noteId}/`),{userId:id})
    .then((res) => this.getNote(noteId) )
    .catch((err) => console.log(err.response.body))
  }

  resetError = () => {
    this.setState({ error: '' });
  }

  render() {
    const { showNote, notes, note, newTag, error,newEdit } = this.state;

    return (
      <div className="App">
        <Nav toggleNote={this.toggleNote} showNote={showNote} />
        {error && <Flash error={error} resetError={this.resetError} />}
        <br />
        { showNote ?
            <Note
              note={note}
              newTag={newTag}
              newEdit={newEdit}
              submitNote={this.submitNote}
              showTagForm={this.showTagForm}
              showEditForm={this.showEditForm}
              closeTagForm={this.closeTagForm}
              closeEditForm={this.closeEditForm}
              addPermission={this.addViewPermission}
              removePermission={this.removeViewPermission}
              editAddPermission={this.addEditPermission}
              removeEditPermission={this.removeEditPermission}
            />
            :
            <List
              getNotes={this.getNotes}
              notes={notes}
              getNote={this.getNote}
              deleteNote={this.deleteNote}
            /> }
      </div>
    );
  }
}

export default Home;

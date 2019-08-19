import React, { Component } from 'react';
import axios from 'axios';
import urlFor from './../../helpers/urlFor';
class Note extends Component {
  constructor(props){
    super(props)
    this.state={
      'userList':[],
      'userEditList':[]
    }
  }
  onSubmit(e) {
    e.preventDefault();
    const formData = {
      title: this.title.value,
      content: this.content.value
    };
    this.props.submitNote(formData, this.props.note.id);
  }

  onUserSubmit(e) {
    e.preventDefault();
    const formData = {
      userId:e.currentTarget.value
    }
    this.props.addPermission(formData, this.props.note.id)
    this.props.closeTagForm();
  }

  onUserEditSubmit(e){
    e.preventDefault();
    const formData = {
      userId:e.currentTarget.value
    }
    this.props.editAddPermission(formData, this.props.note.id)
    this.props.closeEditForm();
  }

  editAllowUserList(note){
    axios.get(urlFor(`UserList/${note.id}/`))
    .then((res) => {
      if(this.state.userList.length!=res.data.view_user_list.length)
          this.setState({userList:res.data.view_user_list})
      if(this.state.userEditList.length!=res.data.edit_user_list.length)
          this.setState({userEditList:res.data.edit_user_list})
      });
  }

  getAddUserList(note){
    this.editAllowUserList(note);
    return this.state.userList.map((user)=>
      <option value={user.id}>{user.first_name}({user.username})</option>
    );
  }

  getEditUserList(note){
    this.editAllowUserList(note);
    return this.state.userEditList.map((user)=>
      <option value={user.id}>{user.first_name}({user.username})</option>
    );
  }
  
  renderAddForm(note) {
    if ( note.id !== undefined) {
      if(!this.props.newTag) {
        return (
          <span>
            Give User Add Permission:
            <i 
              className="tag-button material-icons"
              onClick={() => this.props.showTagForm()}
            >
              add circle
            </i>
          </span>
        );
      } else {
        return (      
          <form>
            <select onChange={(e)=>this.onUserSubmit(e)}>
              <option value="">Select a Member</option>
              {this.getAddUserList(note)}
            </select>
          </form>
        );
      }
    }
  }

  renderAddUserPermission (note) {
    if (note.view_allowed_user) {
      return note.view_allowed_user.map((user, index) =>
        <div
          className="tag"
          key={index}
          onClick={(e) => this.props.removePermission(note.id, user.id)}
        >
          <span className="delete">
            <i className="material-icons">delete</i>
          </span>
          {user.first_name}({user.username})
        </div>
      );
    }
  }

  renderEditForm(note) {
    console.log(this.props)
    if ( note.id !== undefined) {
      if(!this.props.newEdit) {
        return (
          <span>
            Give User Edit Permission:
            <i 
              className="tag-button material-icons"
              onClick={() => this.props.showEditForm()}
            >
              add circle
            </i>
          </span>
        );
      } else {
        return (      
          <form>
            <select onChange={(e)=>this.onUserEditSubmit(e)}>
              <option value="">Select a Member</option>
              {this.getEditUserList(note)}
            </select>
          </form>
        );
      }
    }
  }

  renderEditUserPermission (note) {
    if (note.edit_allowed_user) {
      return note.edit_allowed_user.map((user, index) =>
        <div
          className="tag"
          key={index}
          onClick={(e) => this.props.removeEditPermission(note.id, user.id)}
        >
          <span className="delete">
            <i className="material-icons">delete</i>
          </span>
          {user.first_name}({user.username})
        </div>
      );
    }
  }

  render() {
    const { note, closeTagForm } = this.props;
    return(
      <div className="note-container">
        <h2>Edit This Note</h2>
        <form
          className="note-form"
          onSubmit={(e) => this.onSubmit(e)}
          onClick={() => closeTagForm()}
        >
          <div className="note-title">
            <input
              className="note-title-input"
              type="text"
              placeholder="Note Title..."
              defaultValue={note.title}
              ref={(input) => this.title = input}
            />
          </div>
          <div className="note-textarea-container">
            <textarea
              className="note-textarea"
              placeholder="Type Here..."
              defaultValue={note.content}
              ref={(input) => this.content = input}
            />
          </div>
          <input className="note-button" type="submit" value="Submit" />
        </form>
        {note.user_id == note.user ?
        <div className="tag-container">
          <div className="tag-button-container">
            {this.renderAddForm(note)}
          </div>
          <div className="tag-list-container">
            {this.renderAddUserPermission(note)}
          </div>
        </div>
        :<div></div>}
        {note.user_id == note.user ?
        <div className="tag-container">
          <div className="tag-button-container">
            {this.renderEditForm(note)}
          </div>
          <div className="tag-list-container">
            {this.renderEditUserPermission(note)}
          </div>
        </div>
        :
        <div></div>
        }
      </div>
    );
  }
}

export default Note;
import React, { Component } from 'react';
import './note-card.css';

class NoteCard extends Component {
  renderTags(note) {
    return note.edit_allowed_user.map((user, index) => 
      <span className="note-card-tag" key={index}>
        {user.first_name}
      </span>
    );
  }

  render() {
    const { note, getNote, deleteNote } = this.props;
    return(
    <div class="col-md-3" style={{borderRadius:5}}>
      {note.user_id==note.user?
        <span className="note-card-delete" onClick={() => deleteNote(note.id)}>
          <i className="material-icons">close</i>
        </span>:<span></span>
      }
        <span className="note-card-edit" onClick={() => getNote(note.id)}>
          <i className="material-icons">mode_edit</i>
        </span>
    	<div class="our-team-main">
	        <div class="team-front">
	            <h3>{note.title}</h3><br></br>
	            <p>Created At-: {note.created_at}</p>
	            <p>Modified At-: {note.modified_at}</p><br></br>
              <p><strong>Number of user with edit Permission-:</strong> {note.edit_allowed_user.length}</p>
	            <p><strong>Number of User with view Permission-:</strong> {note.view_allowed_user.length}</p>
              <br></br>
	            <p><strong>Owner-:{note.first_name}({note.username})</strong></p>
	        </div>
	      <div class="team-back">
	        <span>
            {note.content}
	        </span>
	      </div>
	    </div>
	  </div>
    );
  }
}

export default NoteCard;
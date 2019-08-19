import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import auth from './../../../authguard/auth';
class Nav extends Component {
  render() {
    const { toggleNote, showNote } = this.props;
    
    return (
      <div className="nav-container">
        <div className="nav-logo">Notes</div>
        <div className="nav-button" onClick={() => toggleNote()} >
          { showNote ? 'Cancel' :  '+ Note' }
        </div> 
        <div className="nav-button" onClick={() => auth.logout(()=>{
            window.location.reload();
        })} >
          { auth.isAuthenticated() ? 'Logout' :  'Sign In' }
        </div> 
      </div>
    );
  }
}

export default Nav;
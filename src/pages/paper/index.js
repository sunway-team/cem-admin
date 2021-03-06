import React, { Component } from 'react';
import { ActionHome, HardwareKeyboardArrowRight } from 'material-ui/svg-icons';
import { Subheader, IconButton } from 'material-ui';
import { Link } from 'react-router-dom';
import List from './list';
import { connect } from 'react-redux';
class Index extends Component {
  render() {
    const conference_id = this.props.conference_id;
    return (
      <div className="conference">
        <Subheader className="subheader">
          {localStorage.getItem('conferenceTitle')}
        </Subheader>
        <div className="page-breadcrumb d-flex">
          <Link className="d-flex" to="/">
            <IconButton>
              <ActionHome />
            </IconButton>
            <span>Dashboard</span>
          </Link>
          <IconButton>
            <HardwareKeyboardArrowRight />
          </IconButton>
          <span>Papers List</span>
        </div>
        <section className="dashboard content d-flex">
          <List conference_id={conference_id} />
        </section>
      </div>
    );
  }
}
const mapStateToProps = state => {
  if (state.auth.currentUser.currentConference) {
    return {
      conference_id: state.auth.currentUser.currentConference.id,
    };
  }
};
export default connect(mapStateToProps, undefined)(Index);

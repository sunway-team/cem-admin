import React, { Component } from 'react';
import { Subheader, IconButton } from 'material-ui';
import { Link } from 'react-router-dom';
import { ActionHome, HardwareKeyboardArrowRight } from 'material-ui/svg-icons';
import { graphql, compose } from 'react-apollo';
import { queries } from './helpers';
import RoomList from './roomList';
import { connect } from 'react-redux';
import Loading from 'components/render/renderLoading';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
    };
  }
  render() {
    const {
      loading,
      getRoomsByConferenceID,
    } = this.props.GET_ROOMS_BY_CONFERENCE_ID_QUERY;
    if (loading) return <Loading />;
    const listRoom = getRoomsByConferenceID;
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
          <span>Rooms Management</span>
        </div>
        <div className="dashboard content d-flex">
          <RoomList id={this.props.id} listRoom={listRoom} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  id: state.auth.currentUser.currentConference.id,
});

export default compose(
  connect(mapStateToProps, undefined),
  graphql(queries.GET_ROOMS_BY_CONFERENCE_ID_QUERY, {
    options: ownProps => ({
      variables: { conference_id: ownProps.id },
    }),
    name: 'GET_ROOMS_BY_CONFERENCE_ID_QUERY',
  }),
)(Index);

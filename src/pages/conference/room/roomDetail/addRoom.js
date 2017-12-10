import React, { Component } from 'react';
import { Subheader, IconButton } from 'material-ui';
import { Link } from 'react-router-dom';
import { ActionHome, HardwareKeyboardArrowRight } from 'material-ui/svg-icons';
import { graphql, compose } from 'react-apollo';
import { queries, mutations } from '../helpers';
import RoomDetail from './roomDetail';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
  alertOptions,
  MyExclamationTriangle,
  MyFaCheck,
} from '../../../../theme/alert';
import AlertContainer from 'react-alert';

class AddNewRoom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
    };
    this.insertRoom = this.insertRoom.bind(this);
  }
  showAlertError = text => {
    this.msg.error(text, {
      type: 'error', // type of alert
      icon: <MyExclamationTriangle />,
    });
  };
  showAlertSuccess = () => {
    this.msg.success('Saved!', {
      type: 'success',
      icon: <MyFaCheck />,
      onClose: () => {
        this.props.history.replace('/conference/rooms-management');
      },
    });
  };
  async insertRoom({ name, seats, status }) {
    const { INSERT_ROOM_IN_CONFERENCE_MUTATION } = this.props;
    try {
      await INSERT_ROOM_IN_CONFERENCE_MUTATION({
        variables: {
          name: name,
          seats: seats,
          status: status,
        },
        refetchQueries: [
          {
            query: queries.GET_ROOMS_BY_CONFERENCE_ID_QUERY,
          },
        ],
      });
      this.showAlertSuccess();
    } catch (error) {
      let temp = error.graphQLErrors[0].message;
      this.showAlertError(temp.substring(7, temp.length));
    }
  }
  render() {
    return (
      <div className="conference">
        <Subheader className="subheader"> Add New Room </Subheader>
        <div className="page-breadcrumb d-flex">
          <Link className="d-flex" to="/">
            <IconButton>
              <ActionHome />
            </IconButton>
            <span> Conference Information </span>
          </Link>
          <IconButton>
            <HardwareKeyboardArrowRight />
          </IconButton>
          <Link className="d-flex" to="/conference/rooms-management">
            <span> Rooms Management </span>
          </Link>
          <IconButton>
            <HardwareKeyboardArrowRight />
          </IconButton>
          <span> Add New Room </span>
        </div>
        <div className="dashboard content d-flex">
          <RoomDetail onSubmit={this.insertRoom} />
        </div>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => {
  if (state.auth.currentUser && state.auth.currentUser.currentConference) {
    return {
      id: state.auth.currentUser.currentConference.id,
    };
  }
};
export default compose(
  withRouter,
  connect(mapStateToProps, undefined),
  graphql(mutations.INSERT_ROOM_IN_CONFERENCE_MUTATION, {
    name: 'INSERT_ROOM_IN_CONFERENCE_MUTATION',
  }),
)(AddNewRoom);

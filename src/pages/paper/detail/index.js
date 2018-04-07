import React, { Component } from 'react';
import { ActionHome, HardwareKeyboardArrowRight } from 'material-ui/svg-icons';
import { Subheader, IconButton } from 'material-ui';
import { Link } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import { queries } from '../helpers';
import { ListItem } from 'material-ui/List';
import ActionAccountCircle from 'material-ui/svg-icons/action/account-circle';
import CommunicationVpnKey from 'material-ui/svg-icons/communication/vpn-key';
import { AppBar } from 'material-ui';
import { Col, Row } from 'react-flexbox-grid';
import colors from '../../../theme/color';
import MultipleSelect from './multipleSelect';
import './style.css';
import OrganizerDetail from './organizerDetail';
import ReviewerDetail from './reviewerDetail';

import Loading from 'components/render/renderLoading';

class Index extends Component {
  render() {
    const loadingPaper = this.props.GET_PAPER_BY_ID.loading;
    const loadingReviewer = this.props.GET_ALL_USERS_BY_ROLE_ID_QUERY.loading;
    if (loadingPaper || loadingReviewer) return <Loading />;
    let paper;
    paper = this.props.GET_PAPER_BY_ID.getPaperByID;
    let authors;
    let reviewers;
    let comments;
    const role = localStorage.getItem('roles');

    // map author information
    if (paper && paper.authors) {
      authors = paper.authors.map(author => (
        <ListItem
          key={author.id}
          leftIcon={
            <ActionAccountCircle
              color={colors.main}
              className="paper-detail-icon"
            />
          }
          rightIcon={
            // eslint-disable-next-line
            author.corresponding == 1 ? (
              <CommunicationVpnKey color="37d67a" />
            ) : (
              <p />
            )
          }
        >
          {author.author_name}
        </ListItem>
      ));
    }
    //map reviewer information
    if (paper && paper.status !== 'Assigning' && paper.reviewers) {
      reviewers = paper.reviewers.map(reviewer => (
        <ListItem
          key={reviewer.id}
          leftIcon={
            <ActionAccountCircle
              color={colors.main}
              className="paper-detail-icon"
            />
          }
        >
          {reviewer.reviewer_name}
        </ListItem>
      ));
    } else {
      reviewers = (
        <MultipleSelect
          reviewers={
            this.props.GET_ALL_USERS_BY_ROLE_ID_QUERY.getAllUsersByRoleID
          }
          paper_id={paper && paper.id}
        />
      );
    }

    // map comment of each reviewer
    if (paper && paper.comments) {
      comments = paper.comments.map(comment => (
        <div key={comment.id} className="paper-detail-comment">
          <Col xs={2}>
            <Row center="xs">
              <ActionAccountCircle
                color={colors.main}
                className="first-row paper-detail-icon reviewer-icon"
              />
            </Row>
          </Col>
          <Col xs={9}>
            <Row className="card-detail-row first-row">
              <Col xs={9}>
                <Row className="card-detail-row">{comment.reviewer_name}</Row>
                <Row className="card-detail-row">Point : {comment.point}</Row>
                <Row className="card-detail-row">
                  Detail review:{' '}
                  <u style={{ color: 'rgb(114, 181, 240)' }}> this is a link</u>
                </Row>
              </Col>
              <Col xs={3}>
                <div>24/03/2018</div>
              </Col>
            </Row>
            <Row around="xs" className="card-detail-row comment-content-row">
              <div>{comment.content}</div>
            </Row>
          </Col>
        </div>
      ));
    }

    return (
      <div className="conference">
        <Subheader className="subheader">Paper Management</Subheader>
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
          <Link to="/conference/papers">
            <span>Papers List</span>
          </Link>
          <IconButton>
            <HardwareKeyboardArrowRight />
          </IconButton>
          <span>Paper Detail</span>
        </div>
        <AppBar
          className="landing-page-app-bar"
          title={paper.title}
          showMenuIconButton={false}
        />
        <div className="dashboard content d-flex">
          {role === '1' ? (
            <OrganizerDetail
              paper={paper}
              authors={authors}
              reviewers={reviewers}
              comments={comments}
            />
          ) : (
            <ReviewerDetail paper={paper} conference={paper.conference} />
          )}
        </div>
      </div>
    );
  }
}

export default compose(
  graphql(queries.GET_PAPER_BY_ID, {
    name: 'GET_PAPER_BY_ID',
    options: ownProps => ({
      variables: {
        id: ownProps.match.params.id,
      },
    }),
  }),
  graphql(queries.GET_ALL_USERS_BY_ROLE_ID_QUERY, {
    name: 'GET_ALL_USERS_BY_ROLE_ID_QUERY',
    options: ownProps => ({
      variables: {
        role_id: 6,
      },
    }),
  }),
)(Index);

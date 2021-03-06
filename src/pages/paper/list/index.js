import React, { Component } from 'react';
import { graphql, compose, withApollo } from 'react-apollo';
import { queries, mutations } from '../helpers';
import { Link } from 'react-router-dom';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { RaisedButton, Dialog } from 'material-ui';
import Loading from 'components/render/renderLoading';
import { cutString } from '../../../utils/stringSolve';
import StatusForm from './statusForm';
import AlertContainer from 'react-alert';
import {
  alertOptions,
  MyExclamationTriangle,
  MyFaCheck,
} from '../../../theme/alert';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { Grid, Col, Row } from 'react-flexbox-grid';
import PaperReviewInfo from './paperReviewInfo';

const style = {
  paddingLeft: '12px',
  lineHeight: '200%',
};

const styleBtn = {
  margin: '0px 10px',
};

const sorted = [
  {
    id: 'status',
    desc: false,
  },
];

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openStatus: false,
      paper_id: 0,
    };
    this.mapAuthor = this.mapAuthor.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpenStatus = this.handleOpenStatus.bind(this);
    this.handleSetStatus = this.handleSetStatus.bind(this);
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
    });
  };
  mapAuthor(authors) {
    let result = '';
    authors.forEach((element, index) => {
      // eslint-disable-next-line
      if (index != authors.length - 1) {
        result = result + ' ' + element.author_name + ', ';
      } else {
        if (index === 2) {
          result = result + '...';
        } else {
          result = result + ' ' + element.author_name;
        }
      }
    });
    return result;
  }
  handleOpenStatus(paper) {
    this.setState({ openStatus: true, paper_id: paper.id });
  }
  handleClose() {
    this.setState({ openStatus: false });
  }
  async handleSetStatus(value) {
    this.setState({ openStatus: false });
    const { UPDATE_PAPER } = this.props;
    try {
      await UPDATE_PAPER({
        variables: {
          id: this.state.paper_id,
          paper_status_id: value.status,
        },
        refetchQueries: [
          {
            query: queries.GET_PAPERS_BY_CONFERENCE_ID,
            variables: {
              role_id: localStorage.getItem('roles'),
            },
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
    const deadline =
      moment().isAfter(this.props.currentConference.dl_re_review_paper) &&
      moment().isSameOrBefore(
        this.props.currentConference.dl_release_final_paper,
      );
    const role = localStorage.getItem('roles');
    const loadingListPaper = this.props.GET_PAPERS_BY_CONFERENCE_ID.loading;
    if (loadingListPaper) return <Loading />;
    let papers, initialValues;
    papers = this.props.GET_PAPERS_BY_CONFERENCE_ID.getPapersByConferenceID; // get all paper by role
    initialValues = {
      status: 1,
    };
    const columns = [
      {
        Header: 'Title',
        accessor: 'title',
        minWidth: 250,
        Cell: props => <div style={style}>{cutString(props.value, 41)}</div>,
      },
      {
        Header: 'Authors',
        minWidth: 150,
        accessor: 'authors',
        // eslint-disable-next-line
        show: role == 1 ? true : false,
        Cell: props => <div style={style}>{this.mapAuthor(props.value)}</div>,
      },
      {
        Header: 'Topic',
        minWidth: 100,
        accessor: 'topic_name',
        Cell: props => <div style={style}>{props.value}</div>,
      },
      {
        Header: 'Status',
        minWidth: 100,
        accessor: 'status',
        // eslint-disable-next-line
        show: role == 1 ? true : false,
        Cell: props => <div style={style}>{props.value}</div>,
      },
      {
        Header: 'Action',
        minWidth: 200,
        filterable: false,
        accessor: '',
        Cell: props => (
          <div style={{ textAlign: 'left', paddingLeft: '15%' }}>
            <RaisedButton
              label="View"
              default={true}
              containerElement={
                <Link to={`/conference/paper/detail/${props.value.id}`} />
              }
            />
            {role === '1' &&
            deadline &&
            props.value.status !== 'Accepted' &&
            props.value.status !== 'Rejected' ? (
              <RaisedButton
                className="marginLeft"
                secondary={true}
                label="Set Status"
                onClick={() => this.handleOpenStatus(props.value)}
              />
            ) : (
              ''
            )}
            {// eslint-disable-next-line
            (role === '1' || role === '6') && // if user is an organizer or reviewer
            ((props.value.status === 'Reviewing' ||
              props.value.status === 'Re-reviewing') &&
              props.value.is_reviewed === 0) ? ( // and if paper status is reviewing or re-reviewing
              <RaisedButton
                label="Review"
                secondary={true}
                style={styleBtn}
                containerElement={
                  <Link to={`/conference/paper/review/${props.value.id}`} />
                }
              />
            ) : // eslint-disable-next-line
            role === '7' && props.value.status === 'Re-submitting' ? ( // if user is an author // and if paper status is submitting or re-submitting
              <RaisedButton
                label="Re-Submit"
                secondary={true}
                style={styleBtn}
              />
            ) : (
              ''
            )}
          </div>
        ),
      },
    ];
    return (
      <div className="react-table">
        <ReactTable
          // filterable
          data={papers}
          columns={columns}
          defaultSorted={sorted}
          defaultPageSize={10}
          className="-striped -highlight"
          showPaginationTop
        />
        <Dialog
          title="Set paper status"
          modal={true}
          onRequestClose={this.handleClose}
          open={this.state.openStatus}
          titleStyle={{ textAlign: 'center', paddingBottom: '0px' }}
          autoScrollBodyContent={true}
        >
          <Grid className="paper-detail-grid" style={{ color: 'black' }}>
            <Row>
              <Col xs={8} style={{ fontWeight: 'bold', paddingBottom: '1vw' }}>
                General Information
              </Col>
              <Col xs={4} style={{ fontWeight: 'bold', paddingBottom: '1vw' }}>
                Choose Status
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <PaperReviewInfo id={this.state.paper_id} />
              </Col>
              <Col xs={4}>
                <StatusForm
                  onSubmit={this.handleSetStatus}
                  handleClose={this.handleClose}
                  initialValues={initialValues}
                />
              </Col>
            </Row>
          </Grid>
        </Dialog>
        <AlertContainer ref={a => (this.msg = a)} {...alertOptions} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  if (
    state.auth &&
    state.auth.currentUser &&
    state.auth.currentUser.currentConference
  ) {
    return { currentConference: state.auth.currentUser.currentConference };
  }
};

export default compose(
  withApollo,
  graphql(queries.GET_PAPERS_BY_CONFERENCE_ID, {
    name: 'GET_PAPERS_BY_CONFERENCE_ID',
    options: ownProps => ({
      variables: {
        role_id: localStorage.getItem('roles'),
      },
    }),
  }),
  graphql(mutations.UPDATE_PAPER, {
    name: 'UPDATE_PAPER',
  }),
  connect(mapStateToProps, undefined),
)(Index);

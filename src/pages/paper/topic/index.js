import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { queries } from '../helpers';

class Index extends Component {
  render() {
    const { loading, getTopicsByPaperID } = this.props.data;
    if (loading) return <div>Loading...</div>;
    const topics = getTopicsByPaperID;
    return (
      <div>
        {topics.map((data, index) => {
          return (
            <div key={index}>
              <div>{data.topic.name}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default graphql(queries.GET_TOPICS_BY_PAPER_ID, {
  options: ownProps => ({
    variables: { paper_id: ownProps.paper.id },
  }),
})(Index);

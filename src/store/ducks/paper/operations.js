import actions from './actions';

// delete author with id when click button delete indit paper
const deletAuthorIdsOperation = deleteIds => async dispatch => {
  dispatch(actions.deleteAuthorIdsRequested());
  try {
    return dispatch(actions.deleteAuthorIdsSuccess(deleteIds));
  } catch (e) {
    console.log(e);
    return dispatch(actions.deleteAuthorIdsFailure());
  }
};

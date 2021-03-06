import functions from './functions';
import queries from './queries';

export const editActivityFunc = data => {
  const {
    UPDATE_ACTIVITY_WITH_PAPER_ID_MUTATION,
    conferenceId,
    values,
    DELETE_SCHEDULE_MUTATION,
    UPDATE_SCHEDULE_MUTATION,
    INSERT_SCHEDULE_MUTATION,
    deleteIds,
  } = data;
  UPDATE_ACTIVITY_WITH_PAPER_ID_MUTATION({
    variables: {
      id: values.id,
      paper_id: values.paper,
    },
  })
    .then(() => {
      // xoa schedule
      if (deleteIds) {
        // eslint-disable-next-line array-callback-return
        deleteIds.map(id => {
          DELETE_SCHEDULE_MUTATION({
            variables: {
              id: id,
            },
          });
        });
      }

      // lap va update schedule
      // eslint-disable-next-line array-callback-return
      values.schedules.map((schedule, index) => {
        const newStarTime = functions.getDateTime(
          schedule.date,
          schedule.start,
        );

        const newEndTime = functions.getDateTime(schedule.date, schedule.end);
        // eslint-disable-next-line array-callback-return
        if (schedule.id) {
          if (index < values.schedules.length - 1) {
            UPDATE_SCHEDULE_MUTATION({
              variables: {
                id: schedule.id,
                activity_id: values.id,
                start: newStarTime,
                end: newEndTime,
                room_id: schedule.room,
              },
            });
          } else {
            UPDATE_SCHEDULE_MUTATION({
              variables: {
                id: schedule.id,
                activity_id: values.id,
                start: newStarTime,
                end: newEndTime,
                room_id: schedule.room,
              },
              refetchQueries: [
                {
                  query: queries.GET_ACTIVITIES_BY_CONFERENCE_ID_QUERY,
                },
                {
                  query: queries.GET_ACTIVITY_PAPER_BY_ID_QUERY,
                  variables: {
                    id: values.id,
                  },
                },
              ],
            });
          }
        } else {
          INSERT_SCHEDULE_MUTATION({
            variables: {
              activity_id: values.id,
              room_id: schedule.room,
              conference_id: conferenceId,
              start: newStarTime,
              end: newEndTime,
            },
            refetchQueries: [
              {
                query: queries.GET_ACTIVITIES_BY_CONFERENCE_ID_QUERY,
              },
              {
                query: queries.GET_ACTIVITY_PAPER_BY_ID_QUERY,
                variables: {
                  id: values.id,
                },
              },
            ],
          });
        }
      });
    })
    .catch(error => {
      console.log('there was an error sending the query', error);
    });
};

export default editActivityFunc;

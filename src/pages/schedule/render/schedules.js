import React from 'react';
import { Field } from 'redux-form';
import { ActionAlarmAdd, ActionDeleteForever } from 'material-ui/svg-icons';
import { MenuItem, RaisedButton, IconButton } from 'material-ui';
import {
  renderDatePicker,
  renderSelectField,
  renderTimePicker,
} from '../render';
import { connect } from 'react-redux';

const styles = {
  divider: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  smallIcon: {
    width: 36,
    height: 36,
  },

  small: {
    width: 72,
    height: 72,
    padding: 16,
  },
};

class renderSchedules extends React.Component {
  componentDidMount() {
    this.props.fields.removeAll();
    this.props.fields.push({});
  }

  render() {
    const { rooms, fields, meta: { error, submitFailed } } = this.props;
    if (!fields) return <div />;
    return (
      <div>
        {fields.map((schedule, index) => (
          <section key={index}>
            {index === 0 ? (
              ''
            ) : (
              <div>
                <div className="d-flex align-items-center justify-content-space-around">
                  <h4 style={{ paddingTop: '0px' }}>Schedule #{index + 1}</h4>
                  <RaisedButton
                    style={{ minWidth: '50px' }}
                    onClick={() => fields.remove(index)}
                    icon={<ActionDeleteForever />}
                    primary={true}
                  />
                </div>
              </div>
            )}
            <div className="d-flex">
              <div className="d-flex form-group">
                <label className="schedule-date">Date:</label>
                <Field
                  name={`${schedule}.date`}
                  component={renderDatePicker}
                  format={null}
                  textFieldStyle={{ width: '100%' }}
                  hintText="Activity Date"
                />
              </div>
              <div className="d-flex form-group" style={{ width: '300px' }}>
                <label className="text-align-center room">Room :</label>
                <Field name={`${schedule}.room`} component={renderSelectField}>
                  {rooms.map(room => {
                    return (
                      <MenuItem
                        key={room.id}
                        value={room.id}
                        primaryText={room.name}
                      />
                    );
                  })}
                </Field>
              </div>
            </div>
            <div className="d-flex">
              <div className="d-flex form-group">
                <label className="schedule-time-from">Start From :</label>
                <Field
                  name={`${schedule}.start`}
                  component={renderTimePicker}
                  format={null}
                  hintText="Begin Schedule"
                  textFieldStyle={{ width: '100%' }}
                />
              </div>
              <div className="d-flex form-group">
                <label className="text-align-center">To :</label>
                <Field
                  name={`${schedule}.end`}
                  component={renderTimePicker}
                  format={null}
                  hintText="End Schedule"
                  textFieldStyle={{ width: '100%' }}
                />
              </div>
            </div>
          </section>
        ))}
        <div className="d-flex add-schedule-icon btn-group">
          <IconButton
            iconStyle={styles.smallIcon}
            style={styles.small}
            onClick={() => fields.push({})}
            tooltip="Add Schedule"
            disabled={this.props.checkError}
          >
            <ActionAlarmAdd />
          </IconButton>
          {submitFailed && error && <span>{error}</span>}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    checkError: state.schedule.error,
  };
};

export default connect(mapStateToProps, undefined)(renderSchedules);

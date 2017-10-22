import React from 'react';
import { DatePicker, TimePicker, TextField, SelectField } from 'material-ui';

const currentDate = new Date();
const validate = values => {
  const errors = {};
  const ArrayErrors = [];
  const requiredFields = [
    'title',
    'description',
    'date',
    'startTime',
    'endTime',
    'room',
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'This field is required';
    }
  });
  if (values.endTime <= values.startTime) {
    errors.endTime = 'End time of schedule must be greater than start time!!!';
  }
  if (!values.schedules || !values.schedules.length) {
    errors.schedules = { _error: '.' };
  } else {
    values.schedules.forEach((schedule, scheduleIndex) => {
      const scheduleErrors = {};
      if (!schedule || !schedule.date) {
        scheduleErrors.date = 'This field is required';
        ArrayErrors[scheduleIndex] = scheduleErrors;
      }

      if (!schedule || !schedule.room) {
        scheduleErrors.room = 'This field is required';
        ArrayErrors[scheduleIndex] = scheduleErrors;
      }
      if (!schedule || !schedule.startTime) {
        scheduleErrors.startTime = 'This field is required';
        ArrayErrors[scheduleIndex] = scheduleErrors;
      }
      if (!schedule || !schedule.endTime) {
        scheduleErrors.endTime = 'This field is required';
        ArrayErrors[scheduleIndex] = scheduleErrors;
      }
      if (schedule.startTime >= schedule.endTime) {
        scheduleErrors.endTime =
          'End time of schedule must be greater than start time!!!';
        ArrayErrors[scheduleIndex] = scheduleErrors;
      }
    });
    if (ArrayErrors.length) {
      errors.schedules = ArrayErrors;
    }
  }
  return errors;
};

export const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    errorText={touched && error}
    fullWidth={true}
    multiLine={true}
    rows={1}
    {...input}
    {...custom}
  />
);
export const renderSelectField = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}) => (
  <SelectField
    floatingLabelText={label}
    errorText={touched && error}
    {...input}
    onChange={(event, index, value) => input.onChange(value)}
    children={children}
    {...custom}
  />
);
export const renderDatePicker = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <DatePicker
    minDate={currentDate}
    errorText={touched && error}
    onChange={(e, val) => {
      return input.onChange(val);
    }}
    value={input.value}
    {...custom}
  />
);
export const renderTimePicker = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TimePicker
    minutesStep={5}
    errorText={touched && error}
    onChange={(e, val) => {
      return input.onChange(val);
    }}
    value={input.value}
    {...custom}
    autoOk={true}
  />
);
export default validate;

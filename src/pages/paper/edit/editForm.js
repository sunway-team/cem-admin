import React, { Component } from 'react';
import CustomInput from 'components/CustomInput';
import { renderSelectField } from 'components/render';
import { reduxForm, Field } from 'redux-form';
import validate from '../validate';
import { RaisedButton, Subheader, MenuItem } from 'material-ui';
import { Link } from 'react-router-dom';
import EditAuthors from './editAuthors';
import { FieldArray } from 'redux-form';
import FileInput from 'components/render/FileRender';
import { countryData } from '../countryData';

class EditPaperForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  updateCheck() {
    this.setState(oldState => {
      return {
        checked: !oldState.checked,
      };
    });
  }

  render() {
    const topics = this.props.topics;
    const { handleSubmit, pristine, handleUploadFile } = this.props;
    return (
      <form
        className="form conference-info add-paper-form"
        onSubmit={handleSubmit}
      >
        {/* paper */}
        <section className="paper-section">
          <div className="paper-card card-add-paper" around="xs">
            <Subheader className="subheader submit-header">
              Paper Information
            </Subheader>
            <div className="d-flex form-group">
              <label>Title :</label>
              <Field
                name="title"
                component={CustomInput}
                fullWidth={true}
                hintText="Paper Title"
              />
            </div>
            <div className="d-flex form-group">
              <label className="mt30">Abstract :</label>
              <Field
                name="abstract"
                component={CustomInput}
                fullWidth={true}
                multiLine
                rows={2}
                hintText="Paper Abstract"
              />
            </div>
            <div className="d-flex form-group">
              <label>Keywords :</label>
              <Field
                name="keywords"
                component={CustomInput}
                fullWidth={true}
                multiLine
                rows={1}
                hintText="Paper keywords"
              />
            </div>
            <div className="d-flex form-group">
              <label>Topic :</label>
              <Field
                name="topic"
                component={renderSelectField}
                hintText="Paper Topic"
                fullWidth={true}
              >
                {topics.map(topic => {
                  return (
                    <MenuItem
                      key={topic.id}
                      value={topic.id}
                      primaryText={topic.name}
                    />
                  );
                })}
              </Field>
            </div>
            <div className="d-flex form-group file-field">
              <label>File :</label>
              <Field
                name="file"
                component={FileInput}
                onChange={handleUploadFile}
              />
            </div>
          </div>
        </section>
        {/* paper */}
        {/* corresponser */}
        <section className="paper-section">
          <div className="paper-card card-add-paper" around="xs">
            <Subheader className="subheader submit-header">
              Address For Correspondence
            </Subheader>
            <div className="d-flex form-group">
              <label>Street :</label>
              <Field
                name="street"
                component={CustomInput}
                fullWidth={true}
                hintText="Enter the street"
              />
            </div>
            <div className="d-flex form-group">
              <label>City :</label>
              <Field
                name="city"
                component={CustomInput}
                fullWidth={true}
                hintText="Enter the city"
              />
            </div>
            <div className="d-flex form-group">
              <label>Country :</label>
              <Field
                name="country"
                component={renderSelectField}
                fullWidth={true}
                hintText="Choose the country"
              >
                {countryData.map(country => {
                  return (
                    <MenuItem
                      key={country.label}
                      value={country.label}
                      primaryText={country.label}
                    />
                  );
                })}
              </Field>
            </div>
            <div className="d-flex form-group">
              <label>Zipcode :</label>
              <Field
                name="zipcode"
                component={CustomInput}
                fullWidth={true}
                hintText="Enter the zipcode"
              />
            </div>
          </div>
        </section>
        {/* corresponser */}

        {/* author */}
        <FieldArray
          name="editAuthors"
          component={EditAuthors}
          authors={this.props.initialValues}
        />
        {/* author */}

        <div
          style={{ marginBottom: '20px' }}
          className="d-flex save-btn btn-group"
        >
          <RaisedButton
            label="Save"
            primary={true}
            type="submit"
            disabled={pristine}
            className="mr15"
          />
          <RaisedButton
            label="Cancel"
            style={{ marginLeft: '10px' }}
            containerElement={<Link to="/conference/papers" />}
          />
        </div>
      </form>
    );
  }
}

export default reduxForm({
  form: 'EditPaperForm',
  validate,
})(EditPaperForm);

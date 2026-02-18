import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
import NumberFormat from "react-number-format";
import moment from "moment";
import { ApiEndPoints } from "../../../config";
import auth from "../../../auth";
import GridItem from "../../../components/Grid/GridItem.js";
import GridContainer from "../../../components/Grid/GridContainer.js";
import Card from "../../../components/Card/Card.js";
import CardHeader from "../../../components/Card/CardHeader.js";
import CardBody from "../../../components/Card/CardBody.js";
import Button from "../../../components/CustomButtons/Button.js";

import FormFunc from "../../../components/common/formfunc";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

class AssigneeMileForm extends FormFunc {
  state = {
    cndlist: [],
    responseError: "",
    milestoneId: "new",
    milestoneName: "",
    milestoneDetails: "",
    milestoneStartDate: currentDate,
    milestoneendDate: currentDate,
    milestoneValue: "",
    milestoneRevision: "",
    milestonePersonResp: "",

    newform: false,
    milestoneStatus: "",
    milestoneRemarks: "",
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getCnDList();
    await this.getMilestoneById();

    ValidatorForm.addValidationRule("checkEndDate", (value) => {
      if (moment(value).isBefore(this.state.milestoneStartDate)) {
        return false;
      }
      return true;
    });

    ValidatorForm.addValidationRule("checkContractDates", (value) => {
      if (
        moment(value).isBefore(this.props.startDate) ||
        moment(value).isAfter(this.props.endDate)
      ) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    ValidatorForm.removeValidationRule("checkEndDate");
    ValidatorForm.removeValidationRule("checkContractDates");
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  getCnDList() {
    fetch(ApiEndPoints.cndList + "?cndGroup=taskMilestoneStatus", {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ cndlist: data.result, loading: false });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  getMilestoneById() {
    const id = this.props.id;
    if (id === "new") return;
    this.setState({ newform: true });
    fetch(ApiEndPoints.milestoneById + "/" + id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            milestoneId: data.result._id,
            milestoneName: data.result.milestoneName,
            milestoneDetails: data.result.milestoneDetails,
            milestoneStartDate: moment(data.result.startDate * 1000).format(
              "YYYY-MM-DD"
            ),
            milestoneendDate: moment(data.result.endDate * 1000).format(
              "YYYY-MM-DD"
            ),
            milestoneValue: data.result.milestoneValue,
            milestoneRevision: data.result.Revision,

            milestoneStatus: data.result.milestoneStatus,
            milestoneRemarks: data.result.remarks,
          });
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          // NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        }
      })
      .catch(console.log);
  }

  handleSubmit_Milestone = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    var contractId = this.props.contractId;

    const formpojo = {};
    if (this.state.milestoneId !== "new") formpojo.id = this.state.milestoneId;
    else formpojo.id = null;

    formpojo.contract = contractId;
    formpojo.milestoneName = this.state.milestoneName;
    formpojo.milestoneDetails = this.state.milestoneDetails;
    formpojo.startDate = moment(this.state.milestoneStartDate).format("X");
    formpojo.endDate = moment(this.state.milestoneendDate).format("X");
    formpojo.milestoneValue = this.state.milestoneValue;
    formpojo.Revision = this.state.milestoneRevision;

    formpojo.milestoneStatus = this.state.milestoneStatus;
    formpojo.remarks = this.state.milestoneRemarks;
    fetch(
      ApiEndPoints.AddUpdateContract_Milestone +
        "?userid=" +
        auth.getCurrentUser()._id,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-auth-token": auth.getJwt(),
        },
        body: JSON.stringify(formpojo),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          NotificationManager.success("Milestone Updated Successfully");

          this.props.toggle();
          this.props.updateList();
        } else if (
          data &&
          data.success === false &&
          data.responseCode === 401
        ) {
          NotificationManager.error(data.msg);
          localStorage.clear();
          return (window.location.href = "/");
        } else {
          this.setState({ responseError: data.msg });
          this.setState({ savedisabled: false });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const {
      milestoneName,
      milestoneDetails,
      milestoneStartDate,
      milestoneendDate,
      //milestoneValue,
      milestoneRevision,
    } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Update Milestone
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                {/* <span className="error-msg">{this.state.responseError}</span> */}

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit_Milestone}
                  style={{
                    width: "100%",
                    paddingBottom: "-15px",
                    paddingLeft: "15px",
                    paddingRight: "15px",
                  }}
                >
                  <div className="row">
                    <div className="col-md-12 mx-auto">
                      <div className="form-group row">
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Milestone Name *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneName"
                              value={milestoneName}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-8">
                          <FormGroup>
                            <TextValidator
                              label="Milestone Details"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneDetails"
                              value={milestoneDetails}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-4">
                          <FormGroup>
                            {/* <TextValidator
                              label="Milestone Value"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneValue"
                              value={milestoneValue}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            /> */}
                            <NumberFormat
                              customInput={TextValidator}
                              variant="outlined"
                              label="Milestone Value"
                              helperText=" "
                              allowNegative={false}
                              allowLeadingZeros={false}
                              decimalScale={2}
                              value={this.state.milestoneValue}
                              thousandSeparator={true}
                              prefix={"R"}
                              onValueChange={(values) => {
                                const { value } = values;
                                this.setState({ milestoneValue: value });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Start Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneStartDate"
                              type="date"
                              value={milestoneStartDate}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="End Date *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneendDate"
                              type="date"
                              value={milestoneendDate}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Milestone Revision"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneRevision"
                              value={milestoneRevision}
                              variant="outlined"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </FormGroup>
                        </div>

                        <div className="col-sm-4">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Milestone Status *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneStatus"
                              validators={["required"]}
                              errorMessages={["Please Select Milestone Status"]}
                              value={this.state.milestoneStatus}
                            >
                              {this.state.cndlist.map((value, index) => {
                                return (
                                  <option
                                    className="custom-option"
                                    key={index}
                                    value={value._id}
                                  >
                                    {value.cndName}
                                  </option>
                                );
                              })}
                            </SelectValidator>
                          </FormGroup>
                        </div>
                        <div className="col-sm-4">
                          <FormGroup>
                            <TextValidator
                              label="Remarks *"
                              helperText=" "
                              onChange={this.handleChange}
                              name="milestoneRemarks"
                              value={this.state.milestoneRemarks}
                              validators={["required"]}
                              errorMessages={["Remarks are mandatory"]}
                              variant="outlined"
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-12">
                          <span className="mandatory">
                            All (*) marked fields are mandatory
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <Button
                          color="primary"
                          type="submit"
                          disabled={this.state.savedisabled}
                        >
                          {this.state.savedisabled ? "Please wait..." : "Save"}
                        </Button>
                        <span>&nbsp;&nbsp;</span>
                        <Button
                          color="warning"
                          onClick={this.handleCancel.bind(this)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                  </div>
                </ValidatorForm>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}
export default AssigneeMileForm;

import React from "react";
import { NotificationManager } from "react-notifications";
import {
  ValidatorForm,
  TextValidator,
  SelectValidator,
} from "react-material-ui-form-validator";
import FormGroup from "@material-ui/core/FormGroup";
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

class ApproverDataForm extends FormFunc {
  state = {
    cndlist: [],

    approvalHistoryId: "new",
    approverRemarks: "",
    approvalStatus: "",
    approvalStatus_Text: "",
    newform: false,
    savedisabled: false,
  };

  async componentDidMount() {
    await this.getCnDList();
    await this.getApprovalById();
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  approvalStatusChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.setState({ approvalStatus_Text: event.nativeEvent.target.text });
  };

  getCnDList() {
    fetch(ApiEndPoints.cndList + "?cndGroup=ApprovalStatus", {
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
  getApprovalById() {
    const id = this.props.id;

    if (id === "new") return;
    this.setState({ newform: true });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.savedisabled) {
      return;
    }
    this.setState({ savedisabled: true });

    const formpojo = {};
    // if (this.state.approvalHistoryId !== "new")
    //   formpojo.id = this.state.approvalHistoryId;
    // else formpojo.id = null;
    // console.log(
    //   " this.state.approvalStatus_Text : ",
    //   this.state.approvalStatus_Text
    // );
    formpojo.id = this.props.id;
    formpojo.approverId = auth.getCurrentUser()._id;
    formpojo.approverRemarks = this.state.approverRemarks;
    formpojo.approvalStatus = this.state.approvalStatus;
    formpojo.approvalStatus_Text = this.state.approvalStatus_Text;
    fetch(
      ApiEndPoints.addUpdateApprovalHistory +
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
          NotificationManager.success(
            "Record " + this.state.approvalStatus_Text + " Successfully"
          );
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
        }
      })
      .catch("error", console.log);
  };

  handleCancel(event) {
    event.preventDefault();
    this.props.toggle();
  }

  render() {
    const { approverRemarks, cndlist } = this.state;
    let cndlst_Approval = cndlist
      ? cndlist.filter(
        (data) =>
          data.cndGroup === "ApprovalStatus" &&
          data.cndName != "InProgress" &&
          data.cndName != "Initiated"
      )
      : [];

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="primary">
              <h4 className="cardCategoryWhite cardTitleWhite">
                Update Approval Status
              </h4>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <span className="error-msg">{this.state.responseError}</span>

                <ValidatorForm
                  ref="form"
                  instantValidate
                  onError={(errors) => console.log(errors)}
                  onSubmit={this.handleSubmit}
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
                        <div className="col-sm-12">
                          <FormGroup>
                            <SelectValidator
                              variant="outlined"
                              label="Approval Status *"
                              helperText=" "
                              onChange={this.approvalStatusChange}
                              name="approvalStatus"
                              validators={["required"]}
                              errorMessages={["Please Select Approval Status"]}
                              value={this.state.approvalStatus}
                            >
                              {cndlst_Approval.map((value, index) => {
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

                        <div className="col-sm-12">
                          <FormGroup>
                            <TextValidator
                              label="Remarks *"
                              helperText=""
                              onChange={this.handleChange}
                              name="approverRemarks"
                              value={approverRemarks}
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

                      {/*</form>*/}
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
export default ApproverDataForm;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Line, Bar } from "react-chartjs-2";
// import { AreaChart, BarChart } from "react-charts-d3";
import auth from "../../auth";
import { ApiEndPoints } from "../../config";
import moment from "moment";
import queryString from "query-string";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import FlagIcon from "@material-ui/icons/Flag";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import { check } from "./../../utils/authHelper";
import DialogWrapper from "../../components/common/Dialog";
import AlertTable from "../Contracts/alertTable";
import ContractTaskTable from "../Contracts/ContractTasks/contractTaskTable";
import AssigneeTaskForm from "./VerticalTabs/AssigneeTaskForm";
import AssigneeMileForm from "./VerticalTabs/AssigneeMileForm";
import AssigneeMileTable from "./VerticalTabs/AssigneeMileTable";
import ListGroup from "../../components/common/listGroup";
import ApproverDataTable from "./VerticalTabs/approverDataTable";
import ApproverDataForm from "./VerticalTabs/approverDataForm";
import { NotificationManager } from "react-notifications";

// import WidgetModal from "../../components/common/widgetModal";
// import Button from "../../components/CustomButtons/Button.js";
// import Widgets from "../../components/widgets";
import "./dashboard.styles.scss";
import {
  ButtonGroup,
  Card,
  CardBody,
  Col,
  Row,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import Paper from "@material-ui/core/Paper";
import PropTypes from "prop-types";

const currentDate = moment(new Date()).format("YYYY-MM-DD");

function randomNumber() {
  return Math.random() * (40 - 0) + 0;
}

const data = [
  {
    key: "Contract Manager",
    values: [
      { x: "A", y: randomNumber() },
      { x: "B", y: randomNumber() },
      { x: "C", y: randomNumber() },
      { x: "D", y: randomNumber() },
    ],
  },
  {
    key: "Finance Manager",
    values: [
      { x: "A", y: randomNumber() },
      { x: "B", y: randomNumber() },
      { x: "C", y: randomNumber() },
      { x: "D", y: randomNumber() },
    ],
  },
  {
    key: "Agents",
    values: [
      { x: "A", y: randomNumber() },
      { x: "B", y: randomNumber() },
      { x: "C", y: randomNumber() },
      { x: "D", y: randomNumber() },
    ],
  },
];
const data2 = [
  {
    key: "Seeds Contracts",
    values: [
      { x: "A", y: randomNumber() },
      { x: "B", y: randomNumber() },
      { x: "C", y: randomNumber() },
      { x: "D", y: randomNumber() },
    ],
  },
  {
    key: "Irrigation Contracts",
    values: [
      { x: "A", y: randomNumber() },
      { x: "B", y: randomNumber() },
      { x: "C", y: randomNumber() },
      { x: "D", y: randomNumber() },
    ],
  },
  {
    key: "Fertilizer Contracts",
    values: [
      { x: "A", y: randomNumber() },
      { x: "B", y: randomNumber() },
      { x: "C", y: randomNumber() },
      { x: "D", y: randomNumber() },
    ],
  },
];

class DashboardDesign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fields: [
        { farmersCount: 0 },
        { activeContracts: 0 },
        { inActiveContracts: 0 },
        { totalContracts: 0 },
        { planningContracts: 0 },
        { onHoldContracts: 0 },
      ],

      activeIndex: 0,
      loading: true,

      contracts: [],
      action: "",
      responseError: "",
      startDate: currentDate,
      endDate: currentDate,
      fields: { contractId: "", value: "" },
      id: "new",

      alerts: [],
      tasks: [],
      milestones: [],
      task_isOpen: false,
      milestone_isOpen: false,
      approval_isOpen: false,

      approvalData: [],
      approvalAreas: [],
      selectedApprovalArea: {}, //first approval area

      taskTotalRecCount: 0,
      taskSearchText: "",
      taskPer_page: 10,
      taskPage: 1,

      widgetModal: false,
      widgetData: [],
      data: {
        widgetCheck: [],
        chart: [],
      },
      savedisabledWidget: false,
    };

    this.getTasksList = this.getTasksList.bind(this);
    this.getMilestonesList = this.getMilestonesList.bind(this);
    this.getApproverData = this.getApproverData.bind(this);
  }

  componentDidMount() {
    const values = queryString.parse(this.props.location.search);

    if (Object.getOwnPropertyNames(values).length === 0) {
      this.setState({ activeIndex: 0 });
    } else {
      this.setState({
        activeIndex: isNaN(parseInt(values.activeIndex))
          ? 0
          : parseInt(values.activeIndex),
      });
    }

    this.getTilesData();
    //this.getWidgetsData();
    if (check("Dashboard Contract Alerts View Access")) {
      this.getAlertsList();
    }
    //this.getAlertsList();

    if (check("Dashboard Tasks View Access")) {
      if (check("Dashboard Contract Alerts View Access") === false) {
        this.setState({ activeIndex: 1 });
      }
      this.getTasksList(this.state.taskPer_page, 1, this.state.taskSearchText);
    }

    if (check("Dashboard Milestones View Access")) {
      this.getMilestonesList();

      if (
        check("Dashboard Contract Alerts View Access") === false &&
        check("Dashboard Tasks View Access") === false
      ) {
        this.setState({ activeIndex: 2 });
      }
    }
    if (check("Dashboard Approvals View Access")) {
      this.getApprovalAreas();

      if (
        check("Dashboard Contract Alerts View Access") === false &&
        check("Dashboard Tasks View Access") === false &&
        check("Dashboard Milestones View Access") === false
      ) {
        this.setState({ activeIndex: 3 });
      }
    }
  }

  getTilesData() {
    fetch(ApiEndPoints.widgetList)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          farmersCount: data.farmerCount,
          activeContracts: data.activeContracts,
          inActiveContracts: data.inActiveContracts,
          planningContracts: data.planningContracts,
          onHoldContracts: data.onHoldContracts,
          totalContracts: data.totalContracts,
        });
      })
      .catch(console.log);
  }

  //*** dynamic widget start */
  getWidgetsData() {
    fetch(ApiEndPoints.widgetsList, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((dataRes) => {
        console.log("db data res : ", dataRes);
        this.setState({ widgetData: dataRes });

        const { data } = this.state;
        for (let val of dataRes) {
          if (val.select == true && val.type === "Tiles")
            data.widgetCheck.push(JSON.stringify(val));
        }
        this.setState({
          data: { widgetCheck: [...data.widgetCheck] },
        });
      })
      .catch(console.log);
  }

  widgetModal = () => {
    this.setState({
      widgetModal: true,
    });
  };

  toggleWidget = () => {
    this.setState({
      widgetModal: false,
      //data: { widgetCheck: [] },
    });
    // this.getWidgetsData();
  };

  onChange = (e) => {
    const { data } = this.state;
    if (e.target.checked) {
      for (let key in this.state.widgetData) {
        if (this.state.widgetData[key]._id === JSON.parse(e.target.value)._id) {
          this.state.widgetData[key].select = true;
        }
      }
      this.setState({
        data: { [e.target.name]: [...data.widgetCheck, e.target.value] },
      });
    } else {
      for (let key in this.state.widgetData) {
        if (this.state.widgetData[key]._id === JSON.parse(e.target.value)._id) {
          this.state.widgetData[key].select = "";
        }
      }
      let index = data.widgetCheck.indexOf(e.target.value);
      data.widgetCheck.splice(index, 1);
      this.setState({
        data: { [e.target.name]: [...data.widgetCheck] },
      });
    }
  };

  onSubmit = () => {
    this.setState({
      widgetModal: false,
    });

    let formpojo = {};
    formpojo.widgetID = this.state.data.widgetCheck;

    fetch(ApiEndPoints.addUpdateUserWidget, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-auth-token": auth.getJwt(),
      },
      body: JSON.stringify(formpojo),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          NotificationManager.success(data.msg);

          this.setState({ savedisabledWidget: false });
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
          this.setState({ savedisabledWidget: false });
          NotificationManager.error(data.msg);
        }
      })
      .catch("error", console.log);
  };

  ////** dynamic widget end */

  getTasksList(per_page, page, searchText) {
    if (searchText === null) searchText = "";
    if (per_page === null) per_page = 10;
    if (page === null) page = 1;

    console.log("task auth.getCurrentUser()._id : ", auth.getCurrentUser()._id);
    fetch(
      ApiEndPoints.taskList +
        "/" +
        "?personResponsible=" +
        auth.getCurrentUser()._id +
        "&per_page=" +
        per_page +
        "&pageNo=" +
        page +
        "&searchTable=" +
        searchText,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          console.log("task data : ", data);
          this.setState({
            tasks: data.result,
            taskTotalRecCount: data.totalRecCount,
            loading: false,
          });
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

  getMilestonesList() {
    fetch(
      ApiEndPoints.contract_Milestone_List +
        "/" +
        "?personResponsible=" +
        auth.getCurrentUser()._id,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ milestones: data.result, loading: false });
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

  getAlertsList() {
    fetch(ApiEndPoints.alerts + "/" + "?id=" + auth.getCurrentUser()._id, {
      method: "GET",
      headers: { "x-auth-token": auth.getJwt() },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ alerts: data.result, loading: false });
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

  // handleChange_Tab = (_, activeIndex) => {
  //   this.setState({ activeIndex });

  //   if (activeIndex === 0) this.getAlertsList();
  //   if (activeIndex === 1) this.getTasksList();
  //   if (activeIndex === 2) this.getMilestonesList();
  //   if (activeIndex === 3) {
  //     this.getApprovalAreas();
  //   }
  // };

  getApprovalAreas() {
    fetch(
      ApiEndPoints.pendingApprovalAreaList +
        "?userid=" +
        auth.getCurrentUser()._id,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({
            approvalAreas: data.result,
            selectedApprovalArea: {
              _id: data.result[0]._id,
              approvalAreaCode: data.result[0].approvalAreaCode,
              approvalAreaName: data.result[0].approvalAreaName,
            },

            loading: false,
          });

          this.getApproverData(data.result[0].approvalAreaCode);
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

  handleApprovalAreaSelect = (approvalArea) => {
    this.setState({
      selectedApprovalArea: approvalArea,
      loading: true,
      approvalData: [],
    });
    this.getApproverData(approvalArea.approvalAreaCode);
  };

  getApproverData(selectedApprovalArea) {
    fetch(
      ApiEndPoints.pendingApprovalsList +
        "?approvalArea=" +
        selectedApprovalArea +
        "&userid=" +
        auth.getCurrentUser()._id,
      {
        method: "GET",
        headers: { "x-auth-token": auth.getJwt() },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success === true) {
          this.setState({ approvalData: data.result, loading: false });
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

  handleChange = (event, activeIndex) => {
    this.setState({ activeIndex });

    if (activeIndex === 0) this.getAlertsList();
    if (activeIndex === 1)
      this.getTasksList(this.state.taskPer_page, 1, this.state.taskSearchText);
    if (activeIndex === 2) this.getMilestonesList();
    if (activeIndex === 3) {
      this.getApprovalAreas();
    }
  };

  taskChangePage = (page) => {
    this.setState({ taskPage: page });
    this.getTasksList(this.state.taskPer_page, page, this.state.taskSearchText);
  };

  taskChangeRowsPerPage = (per_page) => {
    this.setState({ taskPer_page: per_page });
    this.getTasksList(per_page, this.state.taskPage, this.state.taskSearchText);
  };

  taskSearch = (searchText) => {
    this.setState({ taskSearchText: searchText });
    this.getTasksList(this.state.taskPer_page, 1, searchText);
  };

  render() {
    const taskTableOptions = {
      filterType: "multiselect",
      filter: false,
      download: false,
      responsive: "scroll",
      serverSide: true,
      selectableRows: false,
      sort: false,
      viewColumns: false,
      print: false,
      count: this.state.taskTotalRecCount,
      rowsPerPage: this.state.taskPer_page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case "changePage":
            this.taskChangePage(tableState.page + 1);
            break;
          case "changeRowsPerPage":
            this.taskChangeRowsPerPage(tableState.rowsPerPage);
            break;
          case "search":
            this.taskSearch(tableState.searchText);
            break;
        }
      },
    };

    const {
      farmersCount,
      activeContracts,
      totalContracts,
      activeIndex,
      alerts,
      tasks,
      milestones,
      planningContracts,
      onHoldContracts,
      inActiveContracts,

      selectedApprovalArea,
      approvalAreas,
      approvalData,
      widgetModal,
      data,
    } = this.state;

    // const Alerts =
    //   alerts && alerts.length === 0
    //     ? "Alerts"
    //     : "Alerts (" + alerts.length + ")";
    // const Tasks =
    //   tasks && tasks.length === 0 ? "Tasks" : "Tasks (" + tasks.length + ")";
    // const Milestones =
    //   milestones && milestones.length === 0
    //     ? "Milestones"
    //     : "Milestones (" + milestones.length + ")";
    // const Approvals = approvalData.length === 0 ? "Approvals" : "Approvals";

    //Contract box access
    const CanViewContractBox = check("Dashboard Contract Box Access")
      ? {}
      : { display: "none" };

    //tab permission for approval
    const CanViewAlerts = check("Dashboard Contract Alerts View Access")
      ? {}
      : { display: "none" };
    const CanViewApprovals = check("Dashboard Approvals View Access")
      ? {}
      : { display: "none" };
    const CanViewTasks = check("Dashboard Tasks View Access")
      ? {}
      : { display: "none" };

    const CanViewMilestones = check("Dashboard Milestones View Access")
      ? {}
      : { display: "none" };

    const CheckOtherTabs =
      check("Dashboard Contract Alerts View Access") ||
      check("Dashboard Tasks View Access") ||
      check("Dashboard Milestones View Access") ||
      check("Dashboard Approvals View Access")
        ? {}
        : { display: "none" };

    const checkAllTabs =
      check("Dashboard Contract Alerts View Access") ||
      check("Dashboard Tasks View Access") ||
      check("Dashboard Milestones View Access") ||
      check("Dashboard Approvals View Access")
        ? "block"
        : "none";

    return (
      <div>
        <Row className="animated fadeIn" style={CanViewContractBox}>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-gradient-blue-info ">
              <CardBody className="pb-0">
                <Link
                  to="/contracts?contractStatus=5e831108f7f8f90045f3ac7a"
                  style={{ color: "white" }}
                >
                  <div className="text-value-lg">{activeContracts}</div>
                  <div>Active Contracts</div>
                  <div
                    className="chart-wrapper mt-3"
                    style={{ height: "35px" }}
                  >
                    {/* <Line
                      data={chardata.cardChartData1}
                      options={chardata.cardChartOpts1}
                      height={70}
                    /> */}
                  </div>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-gradient-lblue-info">
              <CardBody className="pb-0">
                {/* <ButtonGroup className="float-right">
                  <Dropdown id='card2'>
                    <DropdownToggle className="p-0" color="transparent">
                      <i className="fa fa-sign-in fa-lg"></i>
                    </DropdownToggle>
                  </Dropdown>
                </ButtonGroup> */}
                <Link
                  to="/contracts?contractStatus=5e8310ebf7f8f90045f3ac79"
                  style={{ color: "white" }}
                >
                  <div className="text-value-lg">{planningContracts}</div>

                  <div> Contracts On-Planning</div>
                  <div
                    className="chart-wrapper mt-3"
                    style={{ height: "35px" }}
                  >
                    {/* <Line
                      data={chardata.cardChartData2}
                      options={chardata.cardChartOpts2}
                      height={70}
                    /> */}
                  </div>
                </Link>
              </CardBody>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-gradient-orange-warning">
              <Link
                to="/contracts?contractStatus=5e83111bf7f8f90045f3ac7b"
                style={{ color: "white" }}
              >
                <CardBody className="pb-0">
                  <div style={{ color: "white" }} className="text-value-lg">
                    {onHoldContracts}
                  </div>
                  <div style={{ color: "white" }}> Contracts On-Hold</div>
                </CardBody>
                <div className="chart-wrapper mt-3" style={{ height: "35px" }}>
                  {/* <Line
                    data={chardata.cardChartData3}
                    options={chardata.cardChartOpts3}
                    height={70}
                  /> */}
                </div>
              </Link>
            </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card className="text-white bg-gradient-red-warning">
              <Link
                to="/contracts?contractStatus=5e8311fff7f8f90045f3ac7c"
                style={{ color: "white" }}
              >
                <CardBody className="pb-0">
                  <div style={{ color: "white" }} className="text-value-lg">
                    {inActiveContracts}
                  </div>
                  <ButtonGroup className="float-left">
                    {/* <i className="fa fa-thumbs-o-down fa-3x"></i> */}
                  </ButtonGroup>

                  <div style={{ color: "white" }}> Contracts InActive</div>
                </CardBody>
                <div className="chart-wrapper mt-3" style={{ height: "35px" }}>
                  {/* <Bar
                    data={chardata.cardChartData4}
                    options={chardata.cardChartOpts4}
                    height={70}
                  /> */}
                </div>
              </Link>
            </Card>
          </Col>
        </Row>
        {/* Quick stats boxes */}
        {/* 
              <div>
                <div className="row">
                  {data.widgetCheck.map(function (value) {
                    let widgetData = JSON.parse(value);
                    if (widgetData.type.toLowerCase() === "tiles")
                      return (
                        <Widgets
                          color={"white"}
                          title={widgetData.name}
                          icon={widgetData.icon}
                          count={widgetData.count}
                          column={3}
                          key={widgetData._id}
                        />
                      );
                  })}
                </div>
                <WidgetModal
                  widgetModal={widgetModal}
                  onSubmit={this.onSubmit}
                  onChange={this.onChange}
                  widgetCheck={data.widgetCheck}
                  widgets={this.state.widgetData}
                  toggle={this.toggleWidget}
                  key={1}
                ></WidgetModal>
              </div> */}

        {/* <div className="row">
          <div className="col-lg-3">
            <div className="card">
              <Link
                to="/contracts?contractStatus=5e831108f7f8f90045f3ac7a"
                style={{ color: "white", fontSize: 12 }}
              >
                <div className="card-body">
                  <div>
                    <h3>{activeContracts}</h3>
                    <div className="list-icons ml-auto">
                      <div className="dropdown">
                        <span
                          className="list-icons-item"
                          data-toggle="dropdown"
                        >
                          <i className="fa fa-file-text font-set-42" />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="font-set-18">
                    Active Contracts
                    <div className="font-size-sm opacity-75 font-set-14">
                      Total Contracts: {totalContracts}
                    </div>
                  </div>
                </div>
                <div id="server-load" />
              </Link>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card bg-blue-400">
              <Link
                to="/contracts?contractStatus=5e8310ebf7f8f90045f3ac79"
                style={{ color: "white", fontSize: 12 }}
              >
                <div className="card-body">
                  <div className="inline-flex">
                    <h3 className="font-weight-semibold mb-0 ">
                      {planningContracts}
                    </h3>
                    <div className="list-icons ml-auto">
                      <span className="list-icons-item" data-toggle="dropdown">
                        <i className="fa fa-file-text-o font-set-42" />
                      </span>
                    </div>
                  </div>
                  <div className="font-set-18">
                    Contracts On-Planning
                    <div className="font-size-sm opacity-75 font-set-14">
                      Total Contracts: {totalContracts}
                    </div>
                  </div>
                </div>
                <div id="today-revenue" />
              </Link>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="card bg-green-400">
              <Link
                to="/contracts?contractStatus=5e83111bf7f8f90045f3ac7b"
                style={{ color: "white", fontSize: 12 }}
              >
                <div className="card-body">
                  <div className="inline-flex">
                    <h3 className="font-weight-semibold mb-0 ">
                      {onHoldContracts}
                    </h3>
                    <div className="list-icons ml-auto">
                      <span className="list-icons-item" data-toggle="dropdown">
                        <i className="fa fa-file-o font-set-42" />
                      </span>
                    </div>
                  </div>
                  <div className="font-set-18">
                    Contracts On-Hold
                    <div className="font-size-sm opacity-75 font-set-14">
                      Total Contracts: {totalContracts}
                    </div>
                  </div>
                </div>
                <div id="today-revenue" />
              </Link>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="card bg-teal-400">
              <Link
                to="/contracts?contractStatus=5e8311fff7f8f90045f3ac7c"
                style={{ color: "white", fontSize: 12 }}
              >
                <div className="card-body">
                  <div className="inline-flex">
                    <h3 className="font-weight-semibold mb-0 ">
                      {inActiveContracts}
                    </h3>
                    <div className="list-icons ml-auto">
                      <span className="list-icons-item" data-toggle="dropdown">
                        <i className="fa fa-file font-set-42" />
                      </span>
                    </div>
                  </div>
                  <div className="font-set-18">
                    Contract InActive
                    <div className="font-size-sm opacity-75 font-set-14">
                      Total Contracts: {totalContracts}
                    </div>
                  </div>
                </div>
                <div className="container-fluid">
                  <div id="members-online" />
                </div>
              </Link>
            </div>
          </div>
        </div> */}

        {/* /quick stats boxes */}

        {/*
              <p className="rsg--para-30">User Registrations</p>
              <AreaChart
                colorScale={{ from: "red", to: "yellow" }}
                data={data}
              />
              <p className="rsg--para-30">Contract Distribution</p>
              <BarChart data={data2} />
            */}

        <Paper
          square
          style={{
            flexGrow: 1,
            display: checkAllTabs,
          }}
        >
          <Tabs
            value={this.state.activeIndex}
            onChange={this.handleChange}
            variant="fullWidth"
            indicatorColor="secondary"
            textColor="secondary"
            aria-label="icon label tabs example"
          >
            <Tab
              icon={<NotificationsActiveIcon />}
              label="Alerts"
              style={CanViewAlerts}
            />
            <Tab
              icon={<AssignmentTurnedInIcon />}
              label="Tasks"
              style={CanViewTasks}
            />
            <Tab
              icon={<FlagIcon />}
              label="Milestones"
              style={CanViewMilestones}
            />
            <Tab
              icon={<VerifiedUserIcon />}
              label="Approvals"
              style={CanViewApprovals}
            />
          </Tabs>
        </Paper>
        <TabPanel
          value={this.state.activeIndex}
          index={0}
          style={CheckOtherTabs}
        >
          <AlertTable loading={this.state.loading} alerts={this.state.alerts} />
        </TabPanel>
        <TabPanel
          value={this.state.activeIndex}
          index={1}
          style={CheckOtherTabs}
        >
          <ContractTaskTable
            loading={this.state.loading}
            tasks={this.state.tasks}
            onEdit={(id) => {
              this.setState({ task_isOpen: true, id: id });
            }}
            tableOptions={taskTableOptions}
          />
        </TabPanel>
        <TabPanel
          value={this.state.activeIndex}
          index={2}
          style={CheckOtherTabs}
        >
          <div className="card">
            <div>
              <AssigneeMileTable
                loading={this.state.loading}
                milestones={this.state.milestones}
                onEdit={(id) => {
                  this.setState({
                    milestone_isOpen: true,
                    id: id,
                  });
                }}
              />
            </div>
          </div>
        </TabPanel>
        <TabPanel
          value={this.state.activeIndex}
          index={3}
          style={CheckOtherTabs}
        >
          <Card>
            <Row>
              <Col xs="12" sm="6" lg="3">
                <ListGroup
                  items={approvalAreas}
                  selectedItem={selectedApprovalArea}
                  onItemSelect={this.handleApprovalAreaSelect}
                />
              </Col>
              <Col xs="12" sm="6" lg="9">
                <ApproverDataTable
                  loading={this.state.loading}
                  approvalData={this.state.approvalData}
                  onEdit={(id) => {
                    this.setState({
                      approval_isOpen: true,
                      id: id,
                    });
                  }}
                />
              </Col>
            </Row>
          </Card>
        </TabPanel>
        {/*              
              <div className="card">
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <VerticalTabs
                      value={activeIndex}
                      onChange={this.handleChange_Tab}
                    >
                      <MyTab
                        style={CheckOtherTabs}
                        label={Alerts}
                        icon={<NotificationsActiveIcon />}
                      ></MyTab>

                      <MyTab
                        style={CanViewTasks}
                        label={Tasks}
                        icon={<AssignmentTurnedInIcon />}
                      />
                      <MyTab
                        style={CanViewMilestones}
                        label={Milestones}
                        icon={<FlagIcon />}
                      />

                      <MyTab
                        style={CanViewApprovals}
                        label={Approvals}
                        icon={<VerifiedUserIcon />}
                      />
                    </VerticalTabs>

                    {activeIndex === 0 && (
                      <TabContainer>
                        <AlertTable
                          loading={this.state.loading}
                          alerts={this.state.alerts}
                        />
                      </TabContainer>
                    )}

                    {activeIndex === 1 && (
                      <TabContainer>
                        <ContractTaskTable
                          loading={this.state.loading}
                          tasks={this.state.tasks}
                          onEdit={(id) => {
                            this.setState({ task_isOpen: true, id: id });
                          }}
                        />
                      </TabContainer>
                    )}
                    {activeIndex === 2 && (
                      <TabContainer>
                        <div className="card">
                          <div>
                            <AssigneeMileTable
                              loading={this.state.loading}
                              milestones={this.state.milestones}
                              onEdit={(id) => {
                                this.setState({
                                  milestone_isOpen: true,
                                  id: id,
                                });
                              }}
                            />
                          </div>
                        </div>
                      </TabContainer>
                    )}
                    {activeIndex === 3 && (
                      <TabContainer>
                        <div className="row">
                          <div className="col-3">
                            <div className="card-body">
                              <ListGroup
                                items={approvalAreas}
                                selectedItem={selectedApprovalArea}
                                onItemSelect={this.handleApprovalAreaSelect}
                              />
                            </div>
                          </div>
                          <div className="col">
                            <div className="card-body">
                              <ApproverDataTable
                                loading={this.state.loading}
                                approvalData={this.state.approvalData}
                                onEdit={(id) => {
                                  this.setState({
                                    approval_isOpen: true,
                                    id: id,
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </TabContainer>
                    )}
                  </div>
                </div>
              </div>
            
             */}
        <br />
        <br />

        {/* Task */}
        <DialogWrapper
          isOpen={this.state.task_isOpen}
          toggle={() =>
            this.setState({
              task_isOpen: !this.state.task_isOpen,
            })
          }
          size="lg"
          className="customeModel"
        >
          <AssigneeTaskForm
            toggle={() =>
              this.setState({
                task_isOpen: !this.state.task_isOpen,
              })
            }
            id={this.state.id}
            updateList={() =>
              this.getTasksList(
                this.state.taskPer_page,
                1,
                this.state.taskSearchText
              )
            }
          />
        </DialogWrapper>

        {/* Milestone */}
        <DialogWrapper
          isOpen={this.state.milestone_isOpen}
          toggle={() =>
            this.setState({
              milestone_isOpen: !this.state.milestone_isOpen,
            })
          }
          size="lg"
          className="customeModel"
        >
          <AssigneeMileForm
            toggle={() =>
              this.setState({
                milestone_isOpen: !this.state.milestone_isOpen,
              })
            }
            id={this.state.id}
            updateList={this.getMilestonesList}
          />
        </DialogWrapper>

        {/* Approvals */}
        <DialogWrapper
          isOpen={this.state.approval_isOpen}
          toggle={() =>
            this.setState({
              approval_isOpen: !this.state.approval_isOpen,
            })
          }
          size="md"
          style={{ width: 900, height: 580 }}
          className="customeModel"
        >
          <ApproverDataForm
            toggle={() =>
              this.setState({
                approval_isOpen: !this.state.approval_isOpen,
              })
            }
            id={this.state.id}
            updateList={() =>
              this.getApproverData(
                this.state.selectedApprovalArea.approvalAreaCode
              )
            }
          />
        </DialogWrapper>

        {/* <Button
                color="primary"
                onClick={this.widgetModal}
                className="position-right btnSetting pop-present"
              >
                <i className="fa fa-cog" />
              </Button> */}
      </div>
    );
  }
}

// const VerticalTabs = withStyles((theme) => ({
//   flexContainer: {
//     flexDirection: "column",
//     backgroundColor: "#18A7B5",
//   },
//   indicator: {
//     display: "none",
//   },
// }))(Tabs);

// const MyTab = withStyles((theme) => ({
//   root: {
//     backgroundColor: "",
//     borderRadius: theme.shape.borderRadius,
//     color: "black",
//   },
//   wrapper: {
//     backgroundColor: "white",
//     padding: theme.spacing(1),
//     borderRadius: theme.shape.borderRadius,
//   },
//   selected: {
//     color: "tomato",
//     //  borderBottom: "3px solid tomato",
//     fontWeight: "bold",
//   },
// }))(Tab);

// function TabContainer(props) {
//   return (
//     <Typography
//       component="div"
//       style={{ padding: 10, border: "2px solid #18A7B5", width: "87%" }}
//     >
//       {props.children}
//     </Typography>
//   );
// }

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default DashboardDesign;

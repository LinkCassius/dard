import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import moment from "moment";
import momentzone from "moment-timezone";

const options = {
  filterType: "multiselect",
  responsive: "scroll",
  selectableRows: false,
  filter: false,
  download: false,
  sort: false,
  viewColumns: false,
  print: false,
  search: false,
  textLabels: {
    body: {
      noMatch: "Sorry we could not find any records!",
    },
  },
};

class ApproverDataTable extends Component {
  columns = [
    {
      name: "Requested Information",
      title: "Requested Information",
      options: {
        headerNoWrap: true,

        customBodyRender: (rowData, tableMeta, updateValue) => {
          return <div style={{ textAlign: "left" }}>{rowData.requestInfo}</div>;
        },
      },
    },
    {
      name: "Date Received",
      title: "Date Received",
      field: "approvalDate",
      key: "approvalDate",
      options: {
        headerNoWrap: true,
        width: 80,
        customBodyRender: (value, tableMeta, updateValue) => {
          let CatZone = moment.tz(value.approvalDate, moment.tz.guess());
          return (
            <div style={{ textAlign: "center" }}>
              {" "}
              {CatZone.format("DD/MM/YYYY")}
            </div>
          );
        },
      },
    },
    {
      name: "Action",
      title: "Action",
      options: {
        headerNoWrap: true,
        width: 120,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          let refId = "",
            refType = "";
          if (rowData.approvalType === "CS" || rowData.approvalType === "CE") {
            refId = "";
            refType = "";
          } else if (rowData.approvalType === "CV") {
            refId = rowData.applicationId;
            refType = "Variation";
          } else if (rowData.approvalType === "CM") {
            refId = rowData.applicationId;
            refType = "Milestone";
          } else if (rowData.approvalType === "CP") {
            refId = rowData.applicationId;
            refType = "Payment";
          }
          return (
            <div style={{ textAlign: "center" }}>
              <i
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="Update Approval Status"
                onClick={() => this.props.onEdit(rowData._id)}
                className="fa fa-edit"
              ></i>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <a
                target="_blank"
                href={
                  "#/contract-document/" +
                  rowData.contractId +
                  "?refId=" +
                  refId +
                  "&refType=" +
                  refType
                }
              >
                <i
                  style={{
                    fontSize: "20px",
                    color: "#2196f3",
                    cursor: "pointer",
                  }}
                  title="Documents"
                  className="fa fa-folder"
                  // onClick={() =>
                  //   this.props.onDoc(
                  //     rowData.contractId,
                  //     rowData.refId,
                  //     rowData.refType
                  //   )
                  // }
                ></i>
              </a>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, approvalData } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Pending Approvals"
          )
        }
        data={approvalData}
        columns={this.columns}
        options={options}
      />
    );
  }
}

export default ApproverDataTable;

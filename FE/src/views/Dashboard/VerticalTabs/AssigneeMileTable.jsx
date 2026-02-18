import React, { Component } from "react";
import MaterialDatatable from "material-datatable";
import Loader from "react-loader-spinner";
import NumberFormat from "react-number-format";

const options = {
  filterType: "multiselect",
  filter: false,
  download: false,
  responsive: "scroll",
  selectableRows: false,
  sort: false,
  viewColumns: false,
  print: false,
};

class AssigneeMileTable extends Component {
  milestoneColumns = [
    {
      name: "Milestone Name",
      title: "Milestone Name",
      field: "milestoneName",
      options: {
        headerNoWrap: true,
      },
    },

    {
      name: "Start Date",
      title: "Start Date",
      field: "startDate",
      key: "startDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.startDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "End Date",
      title: "End Date",
      field: "endDate",
      key: "endDate",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return `${new Date(value.endDate * 1000).toLocaleDateString(
            "en-GB"
          )}`;
        },
      },
    },
    {
      name: "Milestone Value",
      title: "Milestone Value",
      field: "milestoneValue",
      options: {
        headerNoWrap: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <NumberFormat
              value={value.milestoneValue}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"R"}
              decimalScale={2}
              renderText={(value) => (
                <span>
                  {value.includes(".") === true ? value : value + ".00"}
                </span>
              )}
            />
          );
        },
      },
    },
    {
      name: "Person Remarks",
      title: "Person Remarks",
      field: "remarks",
      options: {
        headerNoWrap: true,
      },
    },
    {
      name: "Milestone Status",
      title: "Milestone Status",
      options: {
        headerNoWrap: true,
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              {rowData.milestoneStatus && rowData.milestoneStatus !== null
                ? rowData.milestoneStatus.cndName
                : "Not Yet Started"}
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
        customBodyRender: (rowData, tableMeta, updateValue) => {
          return (
            <div style={{ textAlign: "center" }}>
              <i
                style={{
                  fontSize: "20px",
                  color: "#2196f3",
                  cursor: "pointer",
                }}
                title="View Milestone"
                onClick={() => this.props.onEdit(rowData._id)}
                className="fa fa-edit"
              ></i>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <a
                target="_blank"
                href={
                  "#/contract-document/" +
                  rowData.contract._id +
                  "?refId=" +
                  rowData._id +
                  "&refType=Milestone"
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
                ></i>
              </a>
            </div>
          );
        },
      },
    },
  ];

  render() {
    const { loading, milestones } = this.props;

    return (
      <MaterialDatatable
        striped
        title={
          loading === true ? (
            <Loader type="ThreeDots" color="#00BFFF" height={60} width={60} />
          ) : (
            "Milestones"
          )
        }
        data={milestones}
        columns={this.milestoneColumns}
        options={options}
      />
    );
  }
}

export default AssigneeMileTable;

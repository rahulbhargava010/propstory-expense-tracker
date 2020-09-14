import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import PostAddIcon from "@material-ui/icons/PostAdd";
const role = localStorage.getItem("userRole");

const updateAllocation = () => {
  console.log("data");
};

const columns = [
  { id: "ID", label: "ID", display: "none" },
  {
    id: "SPENT_ON",
    label: "SPENT ON",
    minWidth: 100,
    align: "center",
  },
  { id: "CAMPAIGN_TYPE", label: "CAMPAIGN TYPE", minWidth: 100 },

  { id: "ACTUAL_LEADS", label: "ACTUAL LEADS", minWidth: 100, align: "center" },
  {
    id: "ALLOCATIONS",
    label: "ALLOCATIONS",
    minWidth: 100,
    align: "center",
    edit: true,
    onchange: { updateAllocation },
  },

  {
    id: "CPL",
    label: "CPL",
    minWidth: 50,
    align: "center",
  },
  {
    id: "CLICK",
    label: "CLICK",
    minWidth: 50,
    align: "center",
  },
  {
    id: "IMPRESSIONS",
    label: "IMPRESSIONS",
    minWidth: 50,
    align: "center",
  },
  {
    id: "TOTAL_SPENDING",
    label: "TOTAL SPENDING",
    minWidth: 100,
    align: "center",
  },
  {
    id: "TOTAL_BUDGET",
    label: "TOTAL BUDGET",
    hidden: true
  },
  {
    id: "CAMPAIGN_START_DATE",
    label: "CAMPAIGN START DATE",
    hidden: true
  },
  {
    id: "PLANNED_LEADS",
    label: "PLANNED LEADS",
    hidden: true
  }
];

function createData(
  ID,
  SPENT_ON,
  CAMPAIGN_TYPE,
  ACTUAL_LEADS,
  ALLOCATIONS,
  CPL,
  CLICK,
  IMPRESSIONS,
  TOTAL_SPENDING,
  TOTAL_BUDGET,
  CAMPAIGN_START_DATE,
  PLANNED_LEADS
) {
  return {
    ID,
    SPENT_ON,
    CAMPAIGN_TYPE,
    ACTUAL_LEADS,
    ALLOCATIONS,
    CPL,
    CLICK,
    IMPRESSIONS,
    TOTAL_SPENDING,
    TOTAL_BUDGET,
    CAMPAIGN_START_DATE,
    PLANNED_LEADS
  };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  let totalLead = 0;
  let clicks = 0;
  let impressions = 0;
  let totalSpending = 0;
  let totalAllocation = 0;
  const rows =
    props.result &&
    props.result.map((spending) => {
      totalLead += spending.actualLeads;
      clicks += spending.clicks;
      impressions += spending.impressions;
      totalSpending += spending.totalSpending;
      totalAllocation += spending.allocation;
      console.log(spending);

      // console.log(totalLead)
      return createData(
        spending._id,
        spending.spendingDate,
        spending.campaignType,
        spending.actualLeads,
        spending.allocation,
        spending.cpl,
        spending.clicks,
        spending.impressions,
        parseInt(spending.totalSpending),
        spending.totalBudget,
        spending.campaignStartDate,
        spending.plannedLeads
      );
    });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, display: column.display }}
                  hidden={column.hidden}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center" rowSpan={2} colSpan={3}>ACTIONS</TableCell>
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={2}>
                <h5>TOTAL</h5>
              </TableCell>
              <TableCell align="right">
                <h6>ACTUAL LEADS: {totalLead} </h6>
              </TableCell>
              <TableCell align="center">
                <h6>ALLOCATIONS: {totalAllocation} </h6>
              </TableCell>
              <TableCell align="center">
                <h6>CPL: {Number(totalSpending / totalLead).toFixed(2)}</h6>
              </TableCell>
              <TableCell align="center">
                <h6>CLICKS: {clicks}</h6>
              </TableCell>
              <TableCell align="center">
                <h6>IMPRESSIONS: {impressions}</h6>
              </TableCell>
              <TableCell colSpan={4} align="left">
                <h6>TOTAL SPENDING: {parseFloat(totalSpending).toFixed(2)}</h6>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];

                      return (
                        <TableCell
                          style={{ display: column.display }}
                          key={column.id}
                          align={column.align}
                          hidden={column.hidden}
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}

                    <TableCell
                      onClick={() => props.onEditAllocation(row)}
                      style={{
                        backgroundColor: "#3797a4",
                        fontWeight: 600,
                        fontSize: 10,
                        color: "#fff",
                        width: 30,
                        cursor: "pointer",
                        textAlign: "center"
                      }}

                    >
                      Update Allocation
                    </TableCell>
                    {role == "PSADMIN" ? (
                      <>
                        <TableCell
                          onClick={() => props.onPressEdit(row)}
                          style={{
                            backgroundColor: "#50d890",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                            width: 10
                          }}
                        >
                          <EditOutlinedIcon />
                        </TableCell>
                        <TableCell
                          onClick={() => props.onPressDelete(row["ID"])}
                          style={{
                            backgroundColor: "#fe346e",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                            width: 10
                          }}
                        >
                          <DeleteOutlineIcon />
                        </TableCell>
                      </>
                    ) : null}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

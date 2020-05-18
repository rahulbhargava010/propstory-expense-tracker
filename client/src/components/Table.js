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
import { TableFooter } from "@material-ui/core";

const role = localStorage.getItem("userRole");

const columns = [
  { id: "ID", label: "ID", display: "none" },
  { id: "CAMPAIGN_TYPE", label: "CAMPAIGN TYPE", minWidth: 200 },

  { id: "ACTUAL_LEADS", label: "ACTUAL LEADS", minWidth: 100 },
  { id: "PLANNED_LEADS", label: "PLANNED LEADS", minWidth: 100 },
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
    id: "SPENT_ON",
    label: "SPENT ON",
    minWidth: 100,
    align: "center",
  },
];

function createData(
  ID,
  CAMPAIGN_TYPE,
  ACTUAL_LEADS,
  PLANNED_LEADS,
  CPL,
  CLICK,
  IMPRESSIONS,
  TOTAL_SPENDING,
  SPENT_ON
) {
  return {
    ID,
    CAMPAIGN_TYPE,
    ACTUAL_LEADS,
    PLANNED_LEADS,
    CPL,
    CLICK,
    IMPRESSIONS,
    TOTAL_SPENDING,
    SPENT_ON,
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

  const [al, setAl] = React.useState("");
  let totalLead = 0;
  let cpl = 0;
  let clicks = 0;
  let impressions = 0;
  let totalSpending = 0;
  let numOfLeads = 0;
  const rows =
    props.result &&
    props.result.map((spending) => {
      totalLead += spending.actualLeads;
      cpl += spending.cpl;
      clicks += spending.clicks;
      impressions += spending.impressions;
      totalSpending += spending.totalSpending;
      numOfLeads += 1;

      // console.log(totalLead)
      return createData(
        spending._id,
        spending.campaignType,
        spending.actualLeads,
        spending.plannedLeads,
        spending.cpl,
        spending.clicks,
        spending.impressions,
        spending.totalSpending,
        spending.spendingDate
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
                >
                  {column.label}
                </TableCell>
              ))}
              {role == "PSADMIN" ? (
                <TableCell colSpan={2}>ACTIONS</TableCell>
              ) : null}
            </TableRow>
          </TableHead>
          <TableHead>
            <TableRow>
              <TableCell align="center" colSpan={3}>
                <h6>ACTUAL LEADS: {totalLead} </h6>
              </TableCell>

              <TableCell align="center">
                <h6>CPL: {Number(cpl / numOfLeads).toFixed(2)}</h6>
              </TableCell>
              <TableCell align="center">
                <h6>CLICKS: {clicks}</h6>
              </TableCell>
              <TableCell align="center">
                <h6>IMPRESSIONS: {impressions}</h6>
              </TableCell>
              <TableCell align="center">
                <h6>TOTAL SPENDING: {totalSpending}</h6>
              </TableCell>
              <TableCell align="center" colSpan={3}>
                <h5>TOTAL</h5>
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
                        >
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    {role == "PSADMIN" ? (
                      <>
                        <TableCell
                          onClick={() => props.onPressEdit(row)}
                          style={{
                            backgroundColor: "#00bcd4",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          EDIT
                        </TableCell>
                        <TableCell
                          onClick={() => props.onPressDelete(row["ID"])}
                          style={{
                            backgroundColor: "#cd4545",
                            fontWeight: 600,
                            color: "#fff",
                            cursor: "pointer",
                          }}
                        >
                          DELETE
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

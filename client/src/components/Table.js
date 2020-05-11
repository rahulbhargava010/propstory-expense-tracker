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

const columns = [
  { id: "ACTUAL_LEADS", label: "ACTUAL LEADS", minWidth: 100 },
  { id: "PLANNED_LEADS", label: "PLANNED LEADS", minWidth: 100 },
  {
    id: "CPL",
    label: "CPL",
    minWidth: 50,
    align: "right",
  },
  {
    id: "CLICK",
    label: "CLICK",
    minWidth: 50,
    align: "right",
  },
  {
    id: "IMPRESSIONS",
    label: "IMPRESSIONS",
    minWidth: 50,
    align: "right",
  },
  {
    id: "TOTAL_SPENDING",
    label: "TOTAL SPENDING",
    minWidth: 100,
    align: "right",
  },
  {
    id: "TOTAL_BUDGET",
    label: "TOTAL BUDGET",
    minWidth: 100,
    align: "right",
  },
  {
    id: "SPENT_ON",
    label: "SPENT ON",
    minWidth: 100,
    align: "right",
  },
  {
    id: "CAMPAIGN_START_DATE",
    label: "CAMPAIGN START DATE",
    minWidth: 100,
    align: "right",
  },
];

function createData(
  ACTUAL_LEADS,
  PLANNED_LEADS,
  CPL,
  CLICK,
  IMPRESSIONS,
  TOTAL_SPENDING,
  TOTAL_BUDGET,
  SPENT_ON,
  CAMPAIGN_START_DATE
) {
  return {
    ACTUAL_LEADS,
    PLANNED_LEADS,
    CPL,
    CLICK,
    IMPRESSIONS,
    TOTAL_SPENDING,
    TOTAL_BUDGET,
    SPENT_ON,
    CAMPAIGN_START_DATE,
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

  const rows = [
    props.result &&
      props.result.map((spending) => {
        return createData(
          spending.actualLeads,
          spending.plannedLeads,
          spending.cpl,
          spending.clicks,
          spending.impressions,
          spending.totalSpending,
          spending.totalBudget,
          spending.spendingDate,
          spending.campaignStartDate
        );
      }),
  ];

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
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {value}
                        </TableCell>
                      );
                    })}
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

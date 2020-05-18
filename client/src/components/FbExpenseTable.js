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

  { id: "CAMPAIGN_NAME", label: "CAMPAIGN NAME", minWidth: 120 },
  {
    id: "CLICKS",
    label: "CLICKS",
    minWidth: 50,
    align: "center",
  },
  {
    id: "CPC",
    label: "CPC",
    minWidth: 50,
    align: "center",
  },
  {
    id: "CPM",
    label: "CPM",
    minWidth: 50,
    align: "center",
  },
  {
    id: "CPP",
    label: "CPP",
    minWidth: 50,
    align: "center",
  },
  {
    id: "CTR",
    label: "CTR",
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
    id: "REACH",
    label: "REACH",
    minWidth: 50,
    align: "center",
  },

  {
    id: "CAMPAIGN_START_DATE",
    label: "CAMPAIGN START DATE",
    minWidth: 100,
    align: "center",
  },
];

function createData(
  ID,
  CAMPAIGN_NAME,
  CLICKS,
  CPC,
  CPM,
  CPP,
  CTR,
  IMPRESSIONS,
  REACH,
  CAMPAIGN_START_DATE
) {
  return {
    ID,
    CAMPAIGN_NAME,
    CLICKS,
    CPC,
    CPM,
    CPP,
    CTR,
    IMPRESSIONS,
    REACH,
    CAMPAIGN_START_DATE,
  };
}

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 580,
  },
});

export default function FbExpenseTables(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rows =
    props.data &&
    props.data.map((expense) => {
      // console.log(totalLead)
      return createData(
        expense._id,
        expense.campaign_name,
        expense.clicks,
        Number(expense.cpc).toFixed(2),
        Number(expense.cpm).toFixed(2),
        Number(expense.cpp).toFixed(2),
        Number(expense.ctr).toFixed(2),
        expense.impressions,
        expense.reach,
        expense.date_start.slice(0,10)
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

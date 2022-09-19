import React, { useState } from "react";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TableHead from '@mui/material/TableHead';
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Grid, Skeleton } from "@mui/material";

import SearchBar from "../SearchBar/SearchBar";

import './DataTable.css'

// Pagination functionality to increase rows per page and navigate between pages

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

// Renders loading state

const Loading = ({ numberOfColumns }) => {
  return [...Array(5)].map((i, index) => (
    <TableRow key={`row-${index}`}>
      <TableCell key={`cell-${index}`} colSpan={numberOfColumns} px={3}>
        <Skeleton animation="wave" height={40} />
      </TableCell>
    </TableRow>
  ));
};

// Data table component 

export default function DataTable({ rows, handleSearch, isLoading }) {

  let headlines = ['API', 'Description', 'Link', 'Category'];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  let rowsToRender = rows;

  if (rowsPerPage > 0) {
    rowsToRender = rowsToRender.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
  }


  return (
    <Paper
      className="tableBox"
    >
      <Grid
        className="tableHeader"
        container
      >
        <Grid item xs={6}>
          <h3 className="tableTitle">Database results</h3>
        </Grid>
        <Grid item xs={6}>
          <SearchBar handleSearchInput={handleSearch} />
        </Grid>
      </Grid>
      <TableContainer className="tableContainer">
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              {headlines.map(headline => {
                return <TableCell key={headline}>
                  <p className="tableHeadlines">{headline}</p>
                </TableCell>
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading && <Loading numberOfColumns={headlines.length} />}
            {!isLoading && rowsToRender.length === 0 && (
              <TableRow>
                <TableCell colSpan={headlines.length} rowSpan={3}>
                  <div>No results</div>
                </TableCell>
              </TableRow>
            )}
            {rowsToRender.map(
              (row, rowIndex) => {
                let output = [];
                return (
                  <TableRow key={`row-${rowIndex}`}>
                    {Object.keys(row).forEach((item, cellIndex) => {
                      if (headlines.includes(item)) {
                        output.push(
                          <TableCell key={`cell-${rowIndex}-${cellIndex}`}>
                            <p className="tableCellData">{row[item]}</p>
                          </TableCell>
                        )
                      }
                    })}
                    {output}
                  </TableRow>
                )
              }
            )
            }
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, { label: "All", value: -1 }]}
        colSpan={3}
        count={rows && rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        component="div"
        SelectProps={{
          inputProps: {
            "aria-label": "rows per page",
          },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </Paper>
  );
}

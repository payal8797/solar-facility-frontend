import React from 'react';
import {
  Box,
  TableContainer,
  TablePagination,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow
} from '@mui/material';
import { format } from 'date-fns';

const DataTableComponent = ({
  filteredData,
  showDatainTable,
  columns,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage
}) => {
  return (
    <Box mt={4}>
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell key={column}>{column}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : filteredData
                ).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{format(new Date(row.timestamp), 'yyyy-MM-dd HH:mm')}</TableCell>
                    <TableCell>{row.activePower}</TableCell>
                    <TableCell>{row.energy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
    </Box>
  );
};

export { DataTableComponent };

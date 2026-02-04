import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Card,
  CardHeader,
  CardContent,
  TablePagination,
} from "@mui/material";
import { format } from "date-fns";

interface AIUsageLog {
  _id: string;
  userName: string;
  operationType: string;
  creditsConsumed: number;
  entityId?: string;
  entityType?: string;
  timestamp: Date;
  success: boolean;
}

interface AIUsageHistoryTableProps {
  logs: AIUsageLog[];
  totalCount: number;
  page: number; // 1-based from backend
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
}

const AIUsageHistoryTable: React.FC<AIUsageHistoryTableProps> = ({
  logs,
  totalCount,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const handleChangePage = (event: unknown, newPage: number) => {
    // MUI uses 0-based indexing, backend uses 1-based
    onPageChange(newPage + 1);
  };

  return (
    <Card className="shadow-sm border border-gray-100 rounded-xl">
      <CardHeader title="Detailed Usage History" />
      <CardContent className="p-0">
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="usage history table">
            <TableHead className="bg-gray-50">
              <TableRow>
                <TableCell className="font-semibold text-gray-600">
                  Date & Time
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  User
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Operation
                </TableCell>
                <TableCell className="font-semibold text-gray-600">
                  Entity
                </TableCell>
                <TableCell
                  align="right"
                  className="font-semibold text-gray-600"
                >
                  Cost
                </TableCell>
                <TableCell
                  align="center"
                  className="font-semibold text-gray-600"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    className="py-8 text-gray-500"
                  >
                    No recent usage found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      className="text-gray-700"
                    >
                      {format(new Date(row.timestamp), "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {row.userName}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      <span className="font-medium text-indigo-600">
                        {row.operationType.replace(/_/g, " ")}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {row.entityType ? `${row.entityType}: ` : ""}
                      <span className="font-mono text-xs text-gray-400">
                        {row.entityId
                          ? row.entityId.substring(0, 8) + "..."
                          : "-"}
                      </span>
                    </TableCell>
                    <TableCell
                      align="right"
                      className="font-bold text-gray-800"
                    >
                      {row.creditsConsumed}
                    </TableCell>
                    <TableCell align="center">
                      {row.success ? (
                        <Chip
                          label="Success"
                          color="success"
                          size="small"
                          variant="outlined"
                          className="border-green-200 text-green-700 bg-green-50"
                        />
                      ) : (
                        <Chip
                          label="Failed"
                          color="error"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[20]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page - 1} // MUI expects 0-based
          onPageChange={handleChangePage}
        />
      </CardContent>
    </Card>
  );
};

export default AIUsageHistoryTable;

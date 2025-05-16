"use client";
import { useState, useEffect, useMemo } from "react";
import {MaterialReactTable} from "material-react-table";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper } from "@mui/material";
import "./User.css";

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.users) {
          setUsers(data.users);
        } else {
          console.error("❌ Error fetching users:", data);
        }
      });
  }, []);

  const handleStatusToggle = (id, isActive) => {
    fetch(`http://localhost:5000/api/admin/users/${id}/isActive`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive })
    })
      .then((res) => res.json())
      .then(() => {
        setUsers((prevUsers) =>
          prevUsers.map(user =>
            user._id === id ? { ...user, isActive: !isActive } : user
          )
        );
      })
      .catch(err => console.error("❌ Error updating status:", err));
  };

  const handleConfirmDelete = (id) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    fetch(`http://localhost:5000/api/admin/users/${userToDelete}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then(() => {
        setUsers((prevUsers) => prevUsers.filter(user => user._id !== userToDelete));
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      })
      .catch(err => console.error("❌ Error deleting user:", err));
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const columns = useMemo(() => [
    { accessorKey: "_id", header: "ID" },
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <Box display="flex" gap={1}>
          <Button variant="contained" color="primary" onClick={() => handleView(row.original)}>View</Button>
          <Button 
            variant="contained" 
            color={row.original.isActive ? "success" : "warning"} 
            onClick={() => handleStatusToggle(row.original._id, row.original.isActive)}
          >
            {row.original.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleConfirmDelete(row.original._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ], [users]);

  return (
    <Paper className="user-table" sx={{ padding: 2 }}>
      <MaterialReactTable 
        columns={columns} 
        data={users} 
        enablePagination 
        enableSorting 
        enableColumnFilters
      />

      {/* Dialog لعرض بيانات المستخدم */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div>
              <p><strong>ID:</strong> {selectedUser._id}</p>
              <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog تأكيد حذف المستخدم */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteUser} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

"use client";
import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import {
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
} from "@mui/material";
import { useRouter } from "next/navigation";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/courses", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setLoading(false);
      });
  }, []);

  const toggleIsActive = (id, isActive) => {
    fetch(`http://localhost:5000/api/admin/courses/${id}/active`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    })
      .then((res) => res.json())
      .then(() => {
        setCourses((prev) =>
          prev.map((course) =>
            course._id === id ? { ...course, isActive: !isActive } : course
          )
        );
        setSelectedCourse((prev) => ({ ...prev, isActive: !isActive }));
      })
      .catch((error) => console.error("Error updating isActive:", error));
  };

  const handleDeleteCourse = () => {
    fetch(`http://localhost:5000/api/admin/courses/${selectedCourseId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then(() => {
        setCourses(courses.filter(course => course._id !== selectedCourseId));
        setDeleteDialogOpen(false);
      })
      .catch(error => console.error("Error deleting course:", error));
  };

  const columns = [
    { accessorKey: "title.en", header: "Title" },
    { accessorKey: "price", header: "Price" },
    { accessorKey: "subcategoryId", header: "Category" },
    {
      accessorKey: "actions",
      header: "Actions",
      Cell: ({ row }) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedCourse(row.original);
              setViewDialogOpen(true);
            }}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => router.push(`courses/edit/${row.original._id}`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setSelectedCourseId(row.original._id);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  if (loading) return <CircularProgress />;

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => router.push("/dashboard/courses/add")}
      >
        Add New Course
      </Button>
      <MaterialReactTable columns={columns} data={courses} />

      {/* Dialog لعرض تفاصيل الكورس */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          {selectedCourse && (
            <>
              <p><strong>Title:</strong> {selectedCourse.title.en}</p>
              <p><strong>Price:</strong> ${selectedCourse.price}</p>
              <p><strong>Category:</strong> {selectedCourse.subcategoryId}</p>
              <p><strong>Active:</strong> {selectedCourse.isActive ? "Yes" : "No"}</p>
              <Switch
                checked={selectedCourse.isActive}
                onChange={() => toggleIsActive(selectedCourse._id, selectedCourse.isActive)}
                color="primary"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog تأكيد حذف الكورس */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this course?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteCourse} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Courses;
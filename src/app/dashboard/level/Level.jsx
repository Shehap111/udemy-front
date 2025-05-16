'use client';
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Box, Button, IconButton, Tooltip, Chip, CircularProgress } from '@mui/material';
import { Edit, Delete, Visibility, CheckCircle, Cancel, Add } from '@mui/icons-material';
import { MaterialReactTable } from 'material-react-table';

export default function LevelsTable() {
  const router = useRouter();
  const [data, setData] = useState({ levels: [], courses: {} });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    const [coursesRes, levelsRes] = await Promise.all([
      fetch('http://localhost:5000/api/courses'),
      fetch('http://localhost:5000/api/levels/all')
    ]);

    const [courses, levels] = await Promise.all([
      coursesRes.json(),
      levelsRes.json()
    ]);

    // إنشاء خريطة للكورسات باستخدام الـ _id كمفتاح
    const coursesMap = {};
    courses.data.forEach((course) => {
      coursesMap[course._id] = course.title?.en || course.title || course.name;
    });

    setData({
      levels: levels.data || levels, // تأكد أن البيانات تأتي بشكل صحيح
      courses: coursesMap,
    });
  } catch (error) {
    toast.error(error.message || "Failed to load data");
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => { fetchData(); }, []);

  const handleAction = async (url, method, body, successMsg) => {
    setProcessing(true);
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body && JSON.stringify(body)
      });
      if (!res.ok) throw new Error((await res.json()).message);
      toast.success(successMsg);
      fetchData();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
      setDeleteDialog(null);
    }
  };

  const columns = useMemo(() => [
    { 
      accessorKey: 'levelTitle.en', 
      header: 'Level Name',
      Cell: ({ cell }) => cell.getValue() || 'No title'
    },
{
  accessorFn: (row) => {
    // البحث عن اسم الكورس باستخدام CourseId (بحرف C كبير)
    if (row.CourseId && data.courses[row.CourseId]) {
      return data.courses[row.CourseId];
    }
    return 'No course'; // في حال لم يتم العثور على الكورس
  },
  header: 'Course'
},
    { 
      accessorFn: (row) => row.lessons?.length || 0,
      header: 'Lessons',
      Cell: ({ cell }) => <Chip label={cell.getValue()} variant="outlined" />
    },
    { 
      accessorKey: 'isActive', 
      header: 'Status',
      Cell: ({ cell }) => (
        <Chip 
          label={cell.getValue() ? 'Active' : 'Inactive'} 
          color={cell.getValue() ? 'success' : 'error'} 
          variant="outlined" 
        />
      )
    }
  ], [data.courses]);

  return (
    <Box sx={{ p: 3 }}>
      <MaterialReactTable
        columns={columns}
        data={data.levels}
        state={{ isLoading: loading, showProgressBars: processing }}
        enableRowActions
        renderRowActions={({ row }) => (
          <Box sx={{ display: 'flex', gap: '0.5rem' }}>
            <Tooltip title="Edit">
              <IconButton onClick={() => router.push(`/dashboard/level/edit/${row.original._id}`)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Lessons">
              <IconButton onClick={() => router.push(`/dashboard/level/${row.original._id}/lessons`)}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title={row.original.isActive ? 'Deactivate' : 'Activate'}>
              <IconButton 
                onClick={() => handleAction(
                  `http://localhost:5000/api/levels/${row.original._id}`,
                  'PUT',
                  { isActive: !row.original.isActive },
                  `Level ${row.original.isActive ? 'deactivated' : 'activated'}`
                )}
                color={row.original.isActive ? 'error' : 'success'}
              >
                {processing ? <CircularProgress size={24} /> : row.original.isActive ? <Cancel /> : <CheckCircle />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton 
                color="error" 
                onClick={() => setDeleteDialog(row.original._id)}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/dashboard/level/add')}
          >
            Create New Level
          </Button>
        )}
      />

      {deleteDialog && (
        <Dialog open onClose={() => !processing && setDeleteDialog(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>Are you sure you want to delete this level?</DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog(null)} disabled={processing}>
              Cancel
            </Button>
            <Button 
              color="error" 
              variant="contained"
              onClick={() => handleAction(
                `http://localhost:5000/api/levels/${deleteDialog}`,
                'DELETE',
                null,
                'Level deleted successfully'
              )}
              disabled={processing}
            >
              {processing ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
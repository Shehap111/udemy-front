'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialReactTable } from 'material-react-table';
import { Button, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { fetchQuizzes, updateQuizStatus, deleteQuiz } from '../../../redux/slices/quizzesSlice';
import Link from 'next/link';

const QuizzesTable = () => {
  const dispatch = useDispatch();
  const { quizzes, status } = useSelector((state) => state.quizzes);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const columns = [
    { accessorKey: 'title', header: 'العنوان' },
    { accessorKey: 'course.title.en', header: 'الكورس' },
    { accessorKey: 'level.levelTitle.en', header: 'المستوى' },
    {
      accessorKey: 'isActive',
      header: 'الحالة',
      Cell: ({ cell }) => (cell.getValue() ? 'مفعل' : 'غير مفعل'),
    },
    {
      header: 'الإجراءات',
      Cell: ({ row }) => {
        const quiz = row.original;

        const handleOpenMenu = (e) => setAnchorEl(e.currentTarget);
        const handleCloseMenu = () => setAnchorEl(null);

        const handleToggleStatus = () => {
          dispatch(updateQuizStatus(quiz._id));
          handleCloseMenu();
        };

        const handleOpenDialog = (quizId) => {
          setSelectedQuizId(quizId);
          setOpenDialog(true);
        };

        const handleCloseDialog = () => {
          setOpenDialog(false);
        };

        const handleDelete = () => {
          dispatch(deleteQuiz(selectedQuizId));
          handleCloseDialog();
        };

        return (
          <>
            <IconButton onClick={handleOpenMenu}>
              <MoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem component={Link} href={`/dashboard/quizzes/edit/${quiz._id}`}>
                تعديل
              </MenuItem>
              <MenuItem onClick={handleToggleStatus}>
                {quiz.isActive ? 'تعطيل' : 'تفعيل'}
              </MenuItem>
              <MenuItem onClick={() => handleOpenDialog(quiz._id)}>حذف</MenuItem>
            </Menu>

            {/* Dialog for confirmation of deletion */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
              <DialogTitle>تأكيد الحذف</DialogTitle>
              <DialogContent>
                هل أنت متأكد أنك تريد حذف هذا الكويز؟
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  إلغاء
                </Button>
                <Button onClick={handleDelete} color="primary">
                  حذف
                </Button>
              </DialogActions>
            </Dialog>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {status === 'loading' ? (
        <p>جاري التحميل...</p>
      ) : (
        <MaterialReactTable columns={columns} data={quizzes} />
      )}
    </div>
  );
};

export default QuizzesTable;

'use client'
import {fetchCourses} from '../../../redux/slices/coursesSlice';
import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux';
import '../profile.css'
const My_Courses = () => {
const language = 'en';
const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const {data} = useSelector((state) => state.courses);
  
  useEffect(() => {
  dispatch(fetchCourses())
},[])


const myCourses = data.filter((course) => {
  return user.myCourses?.some((myCourse) => myCourse.courseId === course._id);
});



  
  return (
<section className='My_Courses'>
<h4>My Courses</h4>      
      
<div className="container">
<div className="row">

{myCourses?.length > 0 ? (
  myCourses.map((course) => (
    <div className="col-md-4" key={course._id}>
      <div className=" mb-4 box">
        <img src={course.image} className="card-img-top" alt={course.title} />
        <div className="title_box">
          <h5 className="">{course.title[language]}</h5>
          <p> {course.description[language].slice(0, 120)}{course.description[language].length > 120 && '...'} </p>
          <a href={`/class_room/${course._id}`} className="btn_style">Go to Classroom</a>
        </div>
      </div>
    </div>
  ))
) : (
  <p>No courses available at the moment.</p>
            
)}
</div>        
</div>

      
</section>





  )
}

export default My_Courses
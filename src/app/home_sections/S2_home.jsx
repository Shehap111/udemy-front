'use client'
import React, {useEffect, useState} from 'react'
import Image from 'next/image';
import Image1 from '../../../public/img/down-mark-line.webp'; 
import Image2 from '../../../public/img/overfitting.webp'; 
import './home.css'
import Link  from 'next/link';
import {useSelector} from 'react-redux';
const S2_home = () => {

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const [categories, setCategories] = useState([])
    


  const currentLang = useSelector((state) => state.language.language);

    
useEffect(() => {
    const fetchData = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/categories`)
            const data = await res.json()
            setCategories(data)
        } catch {
            console.error("Error Fetching Categories", error)
        }
    };


    fetchData();
}, []);




    

    
  return (
<section className='S2_home'> 
<div className="container">
    <div className="intro">
        <h3> Top Categories </h3>
        <Image  loading="lazy" width={50} height={50} src={Image1} alt="Description" />  
    </div>          
<div className="row catt_box_container">
{categories.map((catt) => {
    return (
        <div className="col-lg-3 col-md-6 " key={catt._id}>
    <Link href="">
            <div className="box">
                <Image  loading="lazy" src={Image2} alt="Description" />  
                <div className="content">
                    <h4> {catt.title[currentLang]} </h4>
                    <span> 40 course </span>
                </div>
            </div>    
    </Link>
        </div>
    
    );
})}    
</div>          
</div>          
</section>
  )
}

export default S2_home
import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss';

export default function Nav(props) {
  return (
    <div className='nav-layout'>
     <Link to='/demo1'>跳转到demo1</Link>
     {/* <Link to='/demo2'>跳转到demo2</Link> */}
     <Link to='/demo3'>跳转到demo3</Link>
     <Link to='/demo4'>跳转到demo4</Link>
    </div>
  )
}
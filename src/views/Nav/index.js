import React from 'react'
import { Link } from 'react-router-dom'
import './index.scss';

export default function Nav(props) {
  return (
    <div className='nav-layout'>
     <Link to='/demo1'>跳转到demo1</Link>
    </div>
  )
}
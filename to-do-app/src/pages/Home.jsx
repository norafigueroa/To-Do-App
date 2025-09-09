import React from 'react'

import Header from '../components/header/Header'
import Barras from '../components/barra/Barras'
import Listas from '../components/listas/Listas'
import Footer from '../components/footer/Footer'
 

function Home() {
  return (
    <div>

      <Header/>
      <Barras/>
      <Listas/>
      <Footer/>
      
    </div>
  )
}

export default Home
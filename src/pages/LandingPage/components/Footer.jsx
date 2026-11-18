import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

  const navigate = useNavigate();

  const handleRegisterClick = () =>{
    window.scrollTo(0, 0);
    navigate('/search-treatments')
  }

  return (
    <>
    <div className=' flex px-6 md:px-16 lg:pl-40 lg:pr-32 py-8 lg:py-14 max-md:items-center max-md:justify-center justify-between border-t border-[#E5E5E5]'>
        {/* left part */}
        <div  className=' flex flex-col gap-2'>
            <h2 className="text-[#3252DF] font-medium text-[22px] md:text-[26px]">
            Arog<span className="text-[#152C5B]">ini</span>
            </h2>
            <p className=' text-[#B0B0B0] font-poppins font-light text-base w-[69%] max-md:text-xs'>We excel in providing world class affordable health care abroad</p>
        </div>
         {/* right part */}
         <div className=' flex flex-col gap-3'>
              <h2 className=' text-[#152C5B] font-medium text-lg font-poppins max-md:text-sm'>Become stay partner</h2>
              <Button className="bg-[#3252DF] hover:bg-[#3252DF] text-white font-poppins px-6 text-sm w-fit max-md:text-xs max-md:px-2" onClick={handleRegisterClick}>
                     Register Now
                </Button> 

         </div>
    </div>
    <div className='  bg-[#3252DF] h-7'></div>
    </>

  )
}

export default Footer
'use client'
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store';
import { setPage } from '../../redux/slices/currPageSlice';
import { logout } from '../../redux/slices/authSlice';
import { ArrowUp, Home, NotebookTabs, Lightbulb, Calendar, Megaphone, FileText, User, LogOut } from 'lucide-react' 
// import Image from 'next/image'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function LeftSideBar() {
    const dispatch = useDispatch<AppDispatch>();
    const page = useSelector((state: RootState) => state.currPage.page);
    const navigate = useNavigate();
    return (
               <aside className="md:w-[12%] w-full end-0 fixed md:h-screen md:sticky  border-r-1 flex md:flex-col md:items-center md:justify-center border-[#202021] top-0 bg-transparent md:dark:bg-[#050505] dark:bg-transparent">
              <div className="flex md:h-[95vh] h-auto w-full md:pr-8 md:flex-col justify-between items-end p-4">
                {/* <Image
                  className="rounded-full hidden md:flex border-5 border-[#202021]"
                  src="https://avatars.githubusercontent.com/u/109146556?v=4"
                  alt="Description"
                  width={70}
                  height={70}
                /> */}
                <div className='rounded-full hidden md:flex   w-16 h-16'>

                </div>

                <div className="flex gap-8 md:gap-4 md:flex-col justify-center items-start md:ml-4 fixed bottom-0 md:static bg-[#0A0A0B] md:border-t-0 border-t-2 md:border-none border-dashed border-[#202021]  left-0 w-full md:w-auto z-50 py-4 md:py-0 md:bg-transparent">
                  <div className="flex gap-4 group justify-center items-center">
                    <Home
                      className={page === 'home' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('home')); navigate('/home'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Home</h1>
                  </div>
                  
                 

                  <div className="flex gap-4 group justify-center items-center">
                    <NotebookTabs
                      className={page === 'notes' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('notes')); navigate('/notes'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Study Notes</h1>
                  </div>

                  <div className="flex gap-4 group justify-center items-center">
                    <Lightbulb
                      className={page === 'tips' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('tips')); navigate('/tips'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Study Tips</h1>
                  </div>

                  <div className="flex gap-4 group justify-center items-center">
                    <Calendar
                      className={page === 'events' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('events')); navigate('/events'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Events</h1>
                  </div>

                  <div className="flex gap-4 group justify-center items-center">
                    <Megaphone
                      className={page === 'announcements' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('announcements')); navigate('/announcements'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Announcements</h1>
                  </div>

                  {/* <div className="flex gap-4 group justify-center items-center">
                    <FileText
                      className={page === 'files' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('files')); navigate('/files'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Files</h1>
                  </div> */}

                  <div className="flex gap-4 group justify-center items-center">
                    <User
                      className={page === 'profile' ? "text-[#999999] cursor-pointer group  h-12 w-12 p-3 rounded-xl bg-[#141415] dark:text-[#999999]" : "text-[#999999] cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl  dark:text-[#999999]"}
                      size={24}
                      onClick={() => {dispatch(setPage('profile')); navigate('/profile'); window.scrollTo({ top: 0, behavior: 'smooth' })}}
                    />
                    <h1 className="group-hover:text-[#999999] scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100  group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-white absolute right-15 ">Profile</h1>
                  </div>
                </div>
                <div className="md:flex group cursor-pointer flex-col justify-center hidden  items-start ml-4"
                onClick={() => {
                        dispatch(logout());
                        navigate('/login');
                      }}
                >
                  <LogOut
                    className="text-red-500 cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl dark:text-[#999999]"
                    size={24}
                  />
                    <h1 className="group-hover:text-red-500 scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100 group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-red-400 absolute right-15">
                      Logout
                    </h1>
                </div>
                 {/* Logout Button */}
                  {/* <div className="flex gap-4 group justify-center items-center mt-auto">
                    <LogOut
                      className="text-red-500 cursor-pointer group hover:bg-[#0A0A0B] border-1 border-transparent hover:border-[#202021] h-12 w-12 p-3 rounded-xl"
                      size={24}
                      onClick={() => {
                        dispatch(logout());
                        navigate('/login');
                      }}
                    />
                    <h1 className="group-hover:text-red-500 scale-75 bg-transparent text-transparent hidden md:flex group-hover:scale-100 group-hover:right-25 md:group-hover:flex transition-all ease-in-out duration-500 group-hover:bg-[#141415] p-2 px-3 rounded-xl group-hover:dark:text-red-400 absolute right-15">
                      Logout
                    </h1>
                  </div> */}
              </div>
            </aside>
  )
}

export default LeftSideBar

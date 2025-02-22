"use client"
import { LessonPlaner } from "./component/LessonPlanner";
import { useState } from "react";
import { Toaster } from "sonner";
import Login from "./component/Login";

export default function Home() {
  const [isAuthenticated,setIsAuthenticated]=useState(false);
  return (
      <div className="min-h-screen bg-background">
    {
      !isAuthenticated? (
        <Login onLogin={()=>setIsAuthenticated(true)}/>
      ):(
        <LessonPlaner />
      )
    }
    <Toaster/>
      </div>
  );
}

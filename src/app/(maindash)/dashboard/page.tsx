"use client";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import SubmitProfessorLink from '../../../componenets/SubmitProfessorLink';
import AdvancedSearch from '../../../componenets/AdvancedSearch';

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Professor Dashboard</h1>
      <SubmitProfessorLink />
      <AdvancedSearch />
    </div>
  );
}

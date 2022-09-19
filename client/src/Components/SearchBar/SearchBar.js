import React, { useState, useRef } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from "@mui/material/IconButton";
import ClearIcon from '@mui/icons-material/Clear';

import './SearchBar.css'

export default function SearchBar({ handleSearchInput }) {

  const inputRef = useRef(null);
  const [searched, setSearched] = useState('')

  const handleSubmit = () => {
    handleSearchInput(searched)
  }

  const handleClearSearch = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      setSearched('')
      handleSearchInput('')
  }

  return (
    <Paper
      component="div"
      className="searchBox"
      >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        inputRef={inputRef}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search-bar' }}
        onChange={(e) => setSearched(e.target.value)}
      />
      <IconButton type="submit" onClick={() => handleSubmit()} aria-label="search">
        <SearchIcon sx={{ cursor: "pointer" }} />
      </IconButton>
      {!!searched && <IconButton type="submit" onClick={() => handleClearSearch()} aria-label="search">
        <ClearIcon sx={{ cursor: "pointer" }} />
      </IconButton>}
    </Paper>
  );
}


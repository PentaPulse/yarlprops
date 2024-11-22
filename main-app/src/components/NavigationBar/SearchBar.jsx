import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Select,
  MenuItem,
  useTheme,
  Box,
  alpha,
  IconButton,
  Tooltip,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchAllItems } from "../../api/db/items";

export default function SearchBar({ page }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("products");
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [allOptions, setAllOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    // Fetch all items and prepare suggestions
    const fetchItems = async () => {
      setLoading(true);
      try {
        const items = await fetchAllItems();
        setAllOptions(items);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();

    // Set initial search type based on the page
    if (page === "Products") {
      setSearchType("products");
    } else if (page === "Rentals") {
      setSearchType("rentals");
    } else if (page === "Services") {
      setSearchType("services");
    }
  }, [page]);

  const handleSearch = (id, type) => {
    const singularType = type.slice(0, -1); // Convert type to singular
  const path = `/p/${singularType}/${id}`;
  navigate(path);
  };

  const handleSuggestionSelect = (event, newValue) => {
    if (newValue) {
      setSearchTerm(newValue.title);
      setSearchType(newValue.type);
      handleSearch(newValue.id, newValue.type);
    }
  };

  const handleInputChange = (event, value) => {
    setSearchTerm(value);
    const filtered = allOptions.filter((option) =>
      option.title.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: alpha(theme.palette.primary.main, 0.05),
        borderRadius: theme.shape.borderRadius,
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.main, 0.15),
        },
        marginRight: theme.spacing(2),
        padding: theme.spacing(0.5),
        [theme.breakpoints.up("lg")]: {
          width: "800px",
        },
        [theme.breakpoints.down("lg")]: {
          width: "100%",
          alignItems: "stretch",
        },
      }}
    >
      <Tooltip title={"Change item type"}>
        <Select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          sx={{
            marginRight: theme.spacing(2),
            backgroundColor: "transparent",
            borderRadius: theme.shape.borderRadius,
            "& .MuiSelect-select": {
              padding: theme.spacing(1),
              color: theme.palette.primary.main,
            },
            [theme.breakpoints.down("sm")]: {
              marginRight: 0,
              marginBottom: theme.spacing(1),
            },
          }}
        >
          <MenuItem value="products">Products</MenuItem>
          <MenuItem value="rentals">Rentals</MenuItem>
          <MenuItem value="services">Services</MenuItem>
        </Select>
      </Tooltip>
      <Autocomplete
        sx={{ width: "100%" }}
        freeSolo
        options={filteredOptions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.title
        }
        filterOptions={(x) => x} // Use custom filtering logic
        onInputChange={handleInputChange}
        onChange={handleSuggestionSelect}
        loading={loading}
        renderOption={(props, option) => (
          <Box
            component="li"
            {...props}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{option.title}</span>
            <span style={{ color: theme.palette.text.secondary, fontSize: "0.85rem" ,marginLeft:25}}>
              {option.type}
            </span>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            variant="outlined"
            sx={{
              flexGrow: 1,
              "& .MuiInputBase-input": {
                padding: theme.spacing(1),
                width: "100%",
              },
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <IconButton
        variant="contained"
        color="primary"
        onClick={() => handleSearch(searchTerm, searchType)}
        sx={{
          marginLeft: theme.spacing(2),
          [theme.breakpoints.down("sm")]: {
            marginLeft: 0,
          },
        }}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

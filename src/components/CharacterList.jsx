import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  Heading,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import useSWR from "swr";
import { Link } from "react-router-dom";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CharacterList = () => {
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const { data, error } = useSWR(
    `https://swapi.dev/api/people/?page=${page}`,
    fetcher
  );

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const toggleFavorite = (character) => {
    const updatedFavorites = favorites.includes(character)
      ? favorites.filter((fav) => fav !== character)
      : [...favorites, character];

    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  if (error) return <div>Failed to load characters</div>;
  if (!data)
    return (
      <Box
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#8EC5FC",
          backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
        }}
      >
        <Spinner />
      </Box>
    );

  return (
    <Box
      p={4}
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        backgroundColor: "#8EC5FC",
        backgroundImage: "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
      }}
    >
      <Box style={{ width: "80%" }}>
        <Box
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            padding: "8px",
          }}
        >
          <Heading mb={4}>Star Wars Characters</Heading>
        </Box>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {data.results.map((character) => (
            <Link
              key={character.name}
              to={`/character/${character.url.split("/")[5]}`}
              style={{ textDecoration: "none" }} 
            >
              <Box
                p={5}
                shadow="md"
                borderWidth="1px"
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  transition: "transform 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
                _hover={{
                  transform: "scale(1.05)",
                  boxShadow: "lg",
                }}
              >
                <Heading fontSize="xl">{character.name}</Heading>
                <IconButton
                  icon={<StarIcon />}
                  colorScheme={
                    favorites.includes(character.name) ? "yellow" : "gray"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    toggleFavorite(character.name);
                  }}
                />
              </Box>
            </Link>
          ))}
        </Grid>
        <Box mt={4}>
          <Button
            colorScheme="gray"
            onClick={() => setPage(page - 1)}
            isDisabled={!data.previous}
          >
            Previous
          </Button>
          <Button
            colorScheme="gray"
            onClick={() => setPage(page + 1)}
            ml={2}
            isDisabled={!data.next}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterList;

import React from "react";
import { useParams, Link } from "react-router-dom";
import useSWR from "swr";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  List,
  ListItem,
  Spinner,
  Stack,
  StackDivider,
  Text,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";

const fetcher = (url) => fetch(url).then((res) => res.json());

const CharacterDetail = () => {
  const { id } = useParams();
  const { data, error } = useSWR(
    id ? `https://swapi.dev/api/people/${id}/` : null,
    fetcher
  );

  if (error)
    return (
      <Box
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f8ff",
        }}
      >
        <Text fontSize="large">Failed to load character details</Text>
      </Box>
    );
  if (!data)
    return (
      <Box
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f8ff",
        }}
      >
        <Spinner />
      </Box>
    );

  const FilmItem = ({ url,idx }) => {
    const { data, error } = useSWR(url, fetcher);

    if (error) return <ListItem>Failed to load film</ListItem>;
    if (!data) return <ListItem>Loading...</ListItem>;

    return <ListItem> {idx+1}.  {data.title}</ListItem>;
  };

  return (
    <Box
      p={4}
      width="100%"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      backgroundColor="#f0f8ff"
    >
      <Card style={{ width: "60%" }} py={8} px={12}>
        <Stack>
          <Link to="/">
            <Button
              leftIcon={<ArrowBackIcon />}
              colorScheme="gray"
              variant="solid"
            >
              Back
            </Button>
          </Link>
        </Stack>
        <CardHeader display={"flex"} justifyContent={"center"}>
          <Heading>Details</Heading>
        </CardHeader>

        <CardBody>
          <Heading mt={4}>{data.name}</Heading>
          <List>
            <ListItem>
              <Text fontSize="sm">Height: {data.height} cm</Text>
            </ListItem>
            <ListItem>
              <Text fontSize="sm">Mass: {data.mass} kg</Text>
            </ListItem>
            <ListItem>
              <Text fontSize="sm">Hair Color: {data.hair_color}</Text>
            </ListItem>
            <ListItem>
              <Text fontSize="sm">Skin Color: {data.skin_color}</Text>
            </ListItem>
          </List>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Text pt="2" fontSize="sm">
                View a summary of all your clients over the last month.
              </Text>
            </Box>
            <Box style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              <Heading size="md">Movies</Heading>
              <List>
                {data.films.map((film,idx) => (
                  <FilmItem key={film} url={film} idx={idx}/>
                ))}
              </List>
            </Box>
          </Stack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CharacterDetail;

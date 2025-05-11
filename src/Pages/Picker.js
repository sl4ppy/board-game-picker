import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import parser from 'fast-xml-parser';
import { FaDice } from 'react-icons/fa';
import {
  Box,
  Input,
  Button,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon, // Add this import
  Checkbox,
  useToast,
  Icon,
  Select,
  Text,
} from '@chakra-ui/react';

import ChosenGame from '../Components/ChosenGame';
import Game from '../Components/Game';
import AdvancedFilters from '../Components/AdvancedFilters'; // New component for filters
import { formatName, filterPlayerCount } from '../Utils';

export default function Picker() {
  const MAX_RETRY = 5;
  const currentRetry = useRef(1); // Use useRef to avoid unnecessary re-renders
  const toast = useToast();

  const [username, setUsername] = useState('flapj4cks');
  const [activeUsername, setActiveUsername] = useState('flapj4cks');
  const [filters, setFilters] = useState({
    minRating: null,
    rating: null,
    minBGGRating: null,
    numPlayers: null,
    minPlayerCount: null,
    maxPlayerCount: null,
    rated: false,
    played: false,
    comment: false,
    hideExpansions: true,
  });
  const [activeCollection, setActiveCollection] = useState([]);
  const [chosenGame, setChosenGame] = useState();
  const [loading, setLoading] = useState(false);

  const chooseRandomGame = useCallback(() => {
    const game = activeCollection[Math.floor(Math.random() * activeCollection.length)];
    setChosenGame(game);
  }, [activeCollection]);

  useEffect(() => {
    if (activeCollection.length > 0) chooseRandomGame();
  }, [activeCollection, chooseRandomGame]);

  const successHandler = (responses) => {
    let multiCollection = [];
    responses.forEach((res) => {
      let parsedCollection = parser.parse(res.data, { ignoreAttributes: false });
      if (parsedCollection.items.item) {
        const items = Array.isArray(parsedCollection.items.item)
          ? parsedCollection.items.item
          : [parsedCollection.items.item];
        multiCollection.push(...items);
      }
    });

    const filteredCollection = filterPlayerCount(
      multiCollection,
      filters.numPlayers,
      filters.minPlayerCount,
      filters.maxPlayerCount
    );
    setActiveCollection(filteredCollection);
    setActiveUsername(username);
    setLoading(false);

    toast({
      title: filteredCollection.length > 0 ? 'Collection fetched!' : 'No games matched your criteria',
      description: filteredCollection.length > 0
        ? 'Collection successfully downloaded'
        : 'Try adjusting your filters',
      status: filteredCollection.length > 0 ? 'success' : 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  const errorHandler = (err) => {
    if (currentRetry.current < MAX_RETRY) {
      currentRetry.current++;
      setTimeout(requestCollection, 1000 * currentRetry.current);
    } else {
      setLoading(false);
      toast({
        title: 'Not found or took too long',
        description: 'Either the username does not exist, or BGG took too long to generate your collection. Try again.',
        status: 'warning',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const requestCollection = () => {
    setActiveCollection([]);
    setLoading(true);
    currentRetry.current = 1;

    const userNames = username.split(',').map((name) => name.trim());
    const promises = userNames.map((userName) =>
      axios.get('https://www.boardgamegeek.com/xmlapi2/collection', {
        params: {
          username: userName,
          stats: 1,
          own: 1,
          minrating: filters.minRating || null,
          rating: filters.rating || null,
          minbggrating: filters.minBGGRating || null,
          rated: filters.rated ? 1 : null,
          played: filters.played ? 1 : null,
          comment: filters.comment ? 1 : null,
          excludesubtype: filters.hideExpansions ? 'boardgameexpansion' : null,
        },
      })
    );

    Promise.all(promises).then(successHandler).catch(errorHandler);
  };

  return (
    <div className="main">
      <Heading>Game Picker</Heading>
      <Text color="gray.500" align="left">
        Enter your BGG username (or comma-separated list of usernames) and get a random game from your collection{' '}
        <b>marked as owned</b> to play. Use the filters under the 'Advanced' menu to refine your collection to your
        liking.
      </Text>
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="BGG username"
        size="lg"
        style={{ margin: '10px 0', color: '#718096', fontFamily: 'system-ui, sans-serif' }}
      />
      <AdvancedFilters filters={filters} setFilters={setFilters} />
      <Button
        isDisabled={!username.length}
        colorScheme="teal"
        variant={activeCollection.length > 0 ? 'outline' : 'solid'}
        onClick={() => {
          toast({
            title: 'Fetching your collection',
            description: 'This might take a couple of seconds if your collection is big',
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
          requestCollection();
        }}
        isLoading={loading}
        style={{ margin: '10px 0', width: '100%' }}
      >
        {activeCollection.length > 0 ? (
          <>
            Update collection and roll &nbsp; <Icon as={FaDice} />
          </>
        ) : (
          <>
            Get collection and roll &nbsp; <Icon as={FaDice} />
          </>
        )}
      </Button>
      {activeCollection.length > 0 && (
        <Button
          colorScheme="teal"
          onClick={chooseRandomGame}
          isLoading={loading}
          style={{ margin: '10px 0', width: '100%' }}
        >
          Roll &nbsp; <Icon as={FaDice} />
        </Button>
      )}
      {chosenGame && (
        <div className="chosen-game">
          <ChosenGame game={chosenGame} />
        </div>
      )}
      <Accordion allowToggle style={{ marginTop: '2%' }}>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left" style={{ color: '#718096' }}>
              {activeCollection.length === 0
                ? 'No collection loaded'
                : `${formatName(activeUsername)} collection (${activeCollection.length})`}
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {activeCollection.map((game) => (
              <Game key={game.name['#text']} game={game} />
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

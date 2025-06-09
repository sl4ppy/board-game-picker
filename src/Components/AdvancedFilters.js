import React from 'react';
import { Box, Checkbox, Select, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Text } from '@chakra-ui/react';

export default function AdvancedFilters({ filters, setFilters }) {
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  return (
    <Accordion allowToggle>
      <AccordionItem>
        <AccordionButton>
          <Box flex="1" textAlign="left">
            Advanced Filters
          </Box>
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel pb={4}>
          <Box mb={4}>
            <Text fontWeight="bold">Minimum Rating</Text>
            <Select
              placeholder="Select minimum rating"
              value={filters.minRating || ''}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
            >
              {[...Array(11).keys()].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </Select>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold">Minimum BGG Rating</Text>
            <Select
              placeholder="Select minimum BGG rating"
              value={filters.minBGGRating || ''}
              onChange={(e) => handleFilterChange('minBGGRating', e.target.value)}
            >
              {[...Array(11).keys()].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </Select>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold">Number of Players</Text>
            <Select
              placeholder="Select number of players"
              value={filters.numPlayers || ''}
              onChange={(e) => handleFilterChange('numPlayers', e.target.value)}
            >
              {[...Array(11).keys()].slice(1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </Select>
          </Box>

          <Box mb={4}>
            <Text fontWeight="bold">Player Count Range</Text>
            <Select
              placeholder="Min players"
              value={filters.minPlayerCount || ''}
              onChange={(e) => handleFilterChange('minPlayerCount', e.target.value)}
            >
              {[...Array(11).keys()].slice(1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </Select>
            <Select
              placeholder="Max players"
              value={filters.maxPlayerCount || ''}
              onChange={(e) => handleFilterChange('maxPlayerCount', e.target.value)}
              mt={2}
            >
              {[...Array(11).keys()].slice(1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </Select>
          </Box>

          <Box mb={4}>
            <Checkbox
              isChecked={filters.rated}
              onChange={(e) => handleFilterChange('rated', e.target.checked)}
            >
              Rated
            </Checkbox>
          </Box>

          <Box mb={4}>
            <Checkbox
              isChecked={filters.played}
              onChange={(e) => handleFilterChange('played', e.target.checked)}
            >
              Played
            </Checkbox>
          </Box>

          <Box mb={4}>
            <Checkbox
              isChecked={filters.comment}
              onChange={(e) => handleFilterChange('comment', e.target.checked)}
            >
              Commented
            </Checkbox>
          </Box>

          <Box mb={4}>
            <Checkbox
              isChecked={filters.hideExpansions}
              onChange={(e) => handleFilterChange('hideExpansions', e.target.checked)}
            >
              Hide Expansions
            </Checkbox>
          </Box>

          <Box mb={4}>
            <Checkbox
              isChecked={filters.nonRecencyBias}
              onChange={(e) => handleFilterChange('nonRecencyBias', e.target.checked)}
            >
              Non-recency Bias
            </Checkbox>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
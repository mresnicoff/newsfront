import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Noticia from "./Components/Noticia";
import axios from 'axios';
import { Flex, Box, Text } from "@chakra-ui/react";
const MostrarNotas: React.FC = () => {
  interface NewsCardProps {
    date: string;
    author: string;
    title: string;
    description: string;
    autor:{avatar: string; nombre:string}
  }
  const [newsItems, setNewsItems] = useState<NewsCardProps[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const response = await axios.get(`http://localhost:3001/news?page=${page}`);
      const data = await response.data
      console.log(reponse.data)
    setNewsItems((prevNewsItems) => [...prevNewsItems, ...data.articles]);
    setPage(page + 1);
    if (data.articles.length === 0) {
      setHasMore(false);
    }
  };

  return (
    <Flex wrap="wrap" justify="space-between">
      <Box width="80%">
        <InfiniteScroll
          dataLength={newsItems.length}
          next={fetchNews}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more news</p>}
        >
          <Flex wrap="wrap">
            {newsItems.map((news, index) => (
              <Noticia
                key={index}
                date={news.date}
                author={news.autor.nombre}
                title={news.title}
                description={news.description}
              />
            ))}
          </Flex>
        </InfiniteScroll>
      </Box>
      <Box width="20%" p="4">
        {/* Aquí puedes insertar el componente de Google Ads */}
        <Box borderWidth="1px" borderRadius="lg" p="4" boxShadow="md" bg="white">
          <Text>Google Ads</Text>
        </Box>
      </Box>
    </Flex>
  );
};

export default MostrarNotas;
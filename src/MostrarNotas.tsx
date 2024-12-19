// MostrarNotas.tsx
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Noticia from './Components/Noticia';
import { Flex, Box, Text, useBreakpointValue } from "@chakra-ui/react";
import NoticiaModal from './Components/NoticiaModal';  

interface Article {
  key: number;
  id: number;
  date: string;
  autor:{
    nombre: string;
    avatar: string;}
  title: string;
  description: string;
  content: string;
  image: string;
  likes: number;
  onClick: (id: number) => void;
  width: string | number | undefined;
}

const MostrarNotas: React.FC = () => {
  const [searchParams] = useSearchParams();
  const country = searchParams.get('country');
  const category = searchParams.get('category');
  const autor = searchParams.get('autor');
  const keywords = searchParams.get('keywords');
  const [newsItems, setNewsItems] = useState<Article[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedNews, setSelectedNews] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
 // Aquí filtras tus notas según los parámetros obtenidos

  useEffect(() => {
console.log(searchParams)
    fetchNews();
  }, [searchParams]);

  const fetchNews = async () => {
    try {
      const response = await axios.get<{ articles: Article[] }>(apiUrl+`news?page=${page}`);
      const data = response.data;
          const filteredNotes = data.articles.filter(note => {
        let matches = true;
      //  if (country && note.country !== country) matches = false;
      //  if (category && note.category !== category) matches = false;
            if (keywords && !note.description.includes(keywords)) matches = false;
        return matches;
      });
      setNewsItems((prevNewsItems) => [...prevNewsItems, ...filteredNotes]);
      setPage(page + 1);
      if (data.articles.length === 0) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const handleClick = async (id: number) => {
    try {
      const response = await axios.get<{ article: Article }>(apiUrl+`news/${id}`);
      setSelectedNews(response.data.article);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching news detail:", error);
    }
  };

  const cardWidth = useBreakpointValue({ base: "100%", md: "30%" });

  return (
    <Flex wrap="wrap" justify="space-between">
      <Box width="80%" bg="purple">
        <InfiniteScroll
          dataLength={newsItems.length}
          next={fetchNews}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p>No more news</p>}
        >
          <Flex wrap="wrap">
            {newsItems.map((news) => (
              <Noticia
                  key={news.id}
                  id={news.id}
                  date={news.date}
                  nombre={news.autor.nombre}
                  avatar={news.autor.avatar}
                  title={news.title}
                  content=""
                  description={news.description}
                  image={news.image}
                  onClick={() => handleClick(news.id)}
                  width={cardWidth}
                />
            ))}
          </Flex>
        </InfiniteScroll>
      </Box>
      <Box width="20%" p="4">
        <Box position="fixed"
         right="0" top="200"
          bottom="0" borderWidth="1px" borderRadius="lg" p="4" boxShadow="md" bg="white">
          <Text>Google Ads</Text>
        </Box>
      </Box>
      
      {/* Aquí incluimos el componente modal */}
      <NoticiaModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedNews={(selectedNews as Article)}
      />
    </Flex>
  );
};

export default MostrarNotas;
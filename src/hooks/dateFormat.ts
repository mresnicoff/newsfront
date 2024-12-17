export const formatDate = (dateString: string): string => {
    const newsDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
  
    yesterday.setDate(today.getDate() - 1);
  
    if (newsDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (newsDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return newsDate.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };
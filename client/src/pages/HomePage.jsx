import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { FilterBar } from '../components/FilterBar';
import { VideoCard } from '../components/VideoCard';
import { Film } from 'lucide-react';

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');

  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        let url = '/api/videos';
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await axios.get(url);
        setVideos(res.data);
      } catch (err) {
        console.error('[Error fetching videos]:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQuery, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="homepage-container">
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {loading ? (
        <div className="video-grid" style={{ marginTop: '20px' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} style={{ opacity: 0.6 }}>
              <div className="thumbnail-wrapper" style={{ background: 'var(--bg-tertiary)' }} />
              <div style={{ height: '20px', background: 'var(--bg-tertiary)', marginTop: '8px', borderRadius: '4px' }} />
              <div style={{ height: '14px', width: '60%', background: 'var(--bg-tertiary)', marginTop: '4px', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Film size={48} style={{ marginBottom: '16px', color: 'var(--bg-hover)' }} />
          <h3>No videos found</h3>
          <p style={{ marginTop: '8px', fontSize: '0.9rem' }}>
            Try adjusting your search query or selecting a different category filter.
          </p>
        </div>
      ) : (
        <div className="video-grid" style={{ marginTop: '16px' }}>
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

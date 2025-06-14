import React from 'react';
import { useHistory } from 'react-router-dom';

const ViewNewsPreview = ({ news }) => {
  const history = useHistory();

  const handleReadMore = () => {
    // Navigate to the detailed news view page
    history.push(`/view-news/${news.id}`);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      {news.embedYouTubeUrl ? (
        <div style={{ marginBottom: '10px' }}>
          <iframe
            src={news.embedYouTubeUrl}
            title={news.title}
            style={{ width: '100%', height: '200px', border: 'none' }}
            allowFullScreen
          ></iframe>
        </div>
      ) : news.thumbnailUrl ? (
        <img
          src={`data:image/jpeg;base64,${news.thumbnailUrl}`}
          alt="Thumbnail"
          style={{ width: '100%', height: '100%', objectFit: 'cover', marginBottom: '10px' }}
        />
      ) : null}

      <h6 style={{ margin: '5px 0' }}>{news.title}</h6>
      <small className="text-muted">
        {new Date(news.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        })}
      </small>
      <p style={{ marginTop: '5px', fontSize: '0.9rem' }}>{news.summary}</p>

      {/* Display news description */}
      <p style={{ fontSize: '1rem', color: '#555', marginTop: '10px' }}>
        {news.description}
      </p>

      {/* "Read More" button */}
      <button
        onClick={handleReadMore}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          fontSize: '1rem',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Read More
      </button>
    </div>
  );
};

export default ViewNewsPreview;

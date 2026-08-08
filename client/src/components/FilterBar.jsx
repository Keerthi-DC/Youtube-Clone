import React from 'react';

const CATEGORIES = ['All', 'React', 'Coding', 'Music', 'Gaming', 'News', 'Podcasts', 'Tech'];

export const FilterBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="filter-bar">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          className={`filter-chip ${selectedCategory === category ? 'active' : ''}`}
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

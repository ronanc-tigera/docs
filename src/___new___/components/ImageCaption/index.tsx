import React from 'react';
import './styles.css';

const ImageCaption = ({ children }) => {  return (
    <p className="image-caption">
      {children}
    </p>
  );
};

export default ImageCaption

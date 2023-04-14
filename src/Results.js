import React from 'react';

const Results = ({ data }) => {
  return (
    <div>
      {data.map((result, index) => (
        <p key={index}>{result}</p>
      ))}
    </div>
  );
};

export default Results;

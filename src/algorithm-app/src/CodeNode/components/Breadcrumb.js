import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ path }) => (
  <nav aria-label="breadcrumb" className="mb-4">
    <ol className="breadcrumb">
      {path.map((n) => (
        <li key={n.id} className="breadcrumb-item">
          <Link 
            to={`/node/${n.id}`} 
            className="text-decoration-none"
            style={{ 
              color: n.statementTrueFalseFlag === null 
                ? 'blue' 
                : n.statementTrueFalseFlag 
                  ? 'green' 
                  : 'red'
            }}
          >
            {n.title || `Node ${n.id}`}
          </Link>
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
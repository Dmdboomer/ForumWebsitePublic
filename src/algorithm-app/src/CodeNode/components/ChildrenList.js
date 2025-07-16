import React from 'react';
import { Link } from 'react-router-dom';
import ScoreBar from '../../utils/visuals/ScoreBar';
import '../nonGlobalStyle/ChildrenList.css';
import '../../CodeCSS/App.css';

const ChildrenList = ({ children: childrenNodes }) => (
  <div className="children-list-container">
    <div className="children-list-header">
      <h2>Children Nodes</h2>
    </div>
    <ul className="children-list-items">
      {childrenNodes.length === 0 ? (
        <li className="empty-children">No child nodes</li>
      ) : (
        childrenNodes.map(child => (
          <li key={child.id} className="root-card">
            <Link 
              to={`/node/${child.id}`}
              className="children-list-link"
            >
              <div className="children-list-title">
                <span className={child.statementTrueFalseFlag ? 'true-color' : 'false-color'}>
                  {child.title || `Node ${child.id}`}
                </span>
                <div className="children-list-status">
                  {child.statementTrueFalseFlag ? 'True' : 'False'}
                </div>
              </div>
              <div className="children-list-score">
                <ScoreBar 
                  score={child.score} 
                  height={10}
                  showValueInside
                  color={"#4285F4"}
                  label="Weighted Average Score"
                  isCompleted={child.allChildrenCompleted}
                />
              </div>
            </Link>
          </li>
        ))
      )}
    </ul>
  </div>
);

export default ChildrenList;
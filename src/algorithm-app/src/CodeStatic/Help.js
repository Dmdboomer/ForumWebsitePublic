// Help.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CodeCSS/HelpPage.css'; // Import the CSS file

const Help = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  const faqs = [
    {
      category: "Website & Features",
      questions: [
        { q: "What is this website's purpose?", a: "Dashboard -> About Us" },
        { q: "What is the dashboard?", a: "Hover over the top left blue icon on the main pages, it is the menu that slides out" },
        { q: "Where are my saved items?", a: "Dashboard -> Profile -> Saved nodes" }
      ]
    },
    {
      category: "Advanced Explanations",
      questions: [
        {
          q: "How does the website work",
          a: `First you create a Root node which is the statement you are trying to discuss
 -> Then you can create children nodes which will split up the direction of the discussion
-> If you believe that at a certain point, you are able to prove the original statement, leave an "Attempt to Prove" comment
-> After enough endorsements (See below), the node will be marked as "Completed" and will contribute to the scoring algorithms (See below)
This process is not opinion based. Everyone should theoretically come to the same conclusion on all nodes. 
Please try to be objective`
        },
        {
          q: `How are "Attempts to Prove" scored?`,
          a: `If the ratio of Endorsements:Reports is > 10:1 with at least 10 Endorsements, the Node will be marked as completed, and no further actions along this node are permitted. 
          If there is a 1:3 ratio of Reports: Endorsements with at least 5 Reports, an admin will check the Attempt`
        },
        {
          q: `What if I make a bad "Attempt"`,
          a: `There are no penalties for a faulty "Attempt to Prove, However if you believe someones attempt is logically correct/wrong, then endorse/report them. 
If the Attempt is found to go against your reaction by an admin, you could be muted/prevented from actions in the future`
        },
        {
          q: `What is "Weighted average score" metric on scorebars`,
          a: `It is the average score of all the leafs with 1->proving, 0->disproving the origina statment` // Note: Typo 'origina' -> 'original'
        },
        {
          q: `What is "Popularity" metric on scorebars`,
          a: `What percent of people agree with this statement (vote by on each node)`
        },
        {
          q: `What is "Completed Leaf" metric on scorebars`,
          a: `What percent of leafs are completed`
        },
        {
          q: `Why can I not create any children if there are already children`,
          a: `Only 2 children are allowed per node in order to reduce duplicate arguements/ semantically similar nodes` // Note: Typo 'arguements' -> 'arguments'
        },
        {
          q: `Why can I not create any children if the node is completed`,
          a: `Completed nodes are assumed to be logically sound. If you believe there is more to be said, report the "Attempt to Prove" which proved the node`
        },
      ]
    },
    {
      category: "Account",
      questions: [
        { q: "How do I reset my password?", a: "TBA" },
        { q: "Can I change my email address?", a: "TBA" }
      ]
    }
  ];

  return (
    <div className="page-container">
      <h1 className="page-header">❓ Help Center</h1>

      <div className="help-section">
        <h2>Frequently Asked Questions</h2>

        {faqs.map((category, index) => (
          <div key={index} className="faq-category">
            <div
              className="faq-header"
              onClick={() => setActiveCategory(activeCategory === category.category ? null : category.category)}
            >
              <h3>{category.category}</h3>
              <span>{activeCategory === category.category ? '▼' : '▶'}</span>
            </div>

            {activeCategory === category.category && (
              <div className="faq-questions">
                {category.questions.map((faq, qIndex) => (
                  <div key={qIndex} className="faq-item"> {/* Added class here */}
                    <h4>Q: {faq.q}</h4>
                    {/* Apply the CSS class to the answer paragraph */}
                    <p className="preserve-newlines">A: {faq.a}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h2>Still Need Help?</h2>
        <p>Contact our support team:</p>
        <div className="contact-options">
          <button className="contact-button">
            📧 Email Support
          </button>
        </div>
        <Link to="/" className="dashboard-link">
          <span>back</span>
        </Link>
      </div>
    </div>
  );
};

export default Help;
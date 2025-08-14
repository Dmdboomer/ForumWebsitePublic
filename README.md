# [ForestNodes.com](https://ForestNodes.com)
A react,node website that can be used to discuss and build answers to questions.

### How does the website work
- First you create a Root node which is the statement you are trying to discuss
- Then you can create children nodes which will split up the direction of the discussion
- If you believe that at a certain point, you are able to prove the original statement, leave an "Attempt to Prove" comment
- After enough endorsements (See below), the node will be marked as "Completed" and will contribute to the scoring algorithms (See below)
This process is not opinion based. Everyone should theoretically come to the same conclusion on all nodes.
Please try to be objective

### Note:
- Currently, if 2 users endorse an attempt, it will mark the node as complete, and no further actuions can be completed for that branch
- Only 2 children are allowed per node in order to reduce duplicate arguements/ semantically similar nodes (So long as you do not repeat a direct parent)
- Completed nodes are assumed to be logically sound. If you believe there is more to be said, report the "Attempt to Prove" which proved the node

### To do:
- Verify all logic is also done on the backend
- Implement Liking, Disliking Nodes for popularity score
- Implement other algorithms to score nodes, updating the order by filter appropriately
- Improve search page / function
- Private / read only nodes
- Different level accounts such as verified
- Change user information
- Implement a system for admins to take down bad posts, etc from reports
- User warnings/ toggleable explanations the first time the user tries to do anything

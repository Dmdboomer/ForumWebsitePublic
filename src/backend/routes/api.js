const express = require('express');
const router = express.Router();
const {
  getNode,
  getChildren,
  createNode,
  getPathToRoot,
  completeNode,
  likeNode,
  dislikeNode,
  unlikeNode,
  undislikeNode
} = require('../controllers/nodeController');
const { getRoots, createRoot } = require('../controllers/rootController');
const { getComments, createComment,
  getCommentEndorseCount, endorseComment, 
  getCommentReportCount, reportComment, 
  unendorseComment, unreportComment } = require('../controllers/commentController');
const {getTree} = require('../controllers/treeController');
const {getSearch} = require('../controllers/searchController');
const authController = require('../controllers/authController');
const {updateTheme, getTheme} = require('../controllers/settingsController');
const { getSaved, createSave } = require('../controllers/profileController');

// Root endpoints
router.get('/roots/:id', getRoots);
router.post('/roots', createRoot); 
//Searching
router.get('/search', getSearch);

// Node endpoints
router.get('/nodes/:id', getNode);
router.get('/nodes/:id/children', getChildren);
router.post('/nodes', createNode);
router.get('/nodes/:id/path', getPathToRoot);
router.post('/nodes/:id/complete', completeNode);
router.post('/nodes/:id/like/:uid', likeNode);
router.post('/nodes/:id/dislike/:uid', dislikeNode);
router.post('/nodes/:id/unlike/:uid', unlikeNode);
router.post('/nodes/:id/undislike/:uid', undislikeNode);

// Tree visual
router.get('/nodes/:id/tree', getTree);
// Comment endpoints
router.route('/nodes/:id/comments')
  .get(getComments)
  .post(createComment)
router.route('/nodes/:id/comments/:cid/endorse/:uid')
  .post(endorseComment)
router.route('/nodes/:id/comments/:cid/report/:uid')
  .post(reportComment)
router.route('/nodes/:id/comments/:cid/unendorse/:uid')
  .post(unendorseComment)
router.route('/nodes/:id/comments/:cid/unreport/:uid')
  .post(unreportComment)
router.get('/nodes/:id/comments/:cid/endorse/count', getCommentEndorseCount);
router.get('/nodes/:id/comments/:cid/report/count', getCommentReportCount);

// Account Apis
router.get('/user', authController.checkSession);
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/logout', authController.logout);
router.get('/dashboard', authController.getDashboardData);
router.post('/auth/google', authController.googleAuth);


// user APIs
router.post('/saved', getSaved);
router.post('/save', createSave);

// settings Apis
router.post('/theme', updateTheme);
router.get('/theme', getTheme);


module.exports = router;
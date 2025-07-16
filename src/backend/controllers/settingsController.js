const db = require('../db');

exports.updateTheme = async (req, res) => {
  try {
    const userId = req.session.userId;
    console.log(userId)
    if (!req.session.userId) { // Changed from req.session.user
      return res.status(401).json({ error: 'Unauthorized' });
    }
        
    const { themeName } = req.body;
    console.log(themeName)
    
    // Verify theme exists in database
    const [themeRows] = await db.query(
      `SELECT theme_table_id 
      FROM theme_table_dimension
      WHERE theme_name = ?`,
      [themeName]
    );
    
    if (!themeRows || themeRows.length === 0) {
      return res.status(400).json({ error: 'Invalid theme name' });
    }
    
    // Update user's theme preference
    await db.query(
      'UPDATE user_settings SET theme_table_id = ? WHERE UUID = ?',
      [themeRows[0].theme_table_id, userId]
    );
    
    res.status(200).json({ success: true });
    console.log('done');
  } catch (error) {
    console.error('Theme update error:', error);
    res.status(500).json({ error: 'Theme update failed' });
  }
};

exports.getTheme = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    console.log(userId)
    
    const [userSettings] = await db.query(
      `SELECT ttd.theme_name
       FROM user_settings us 
       JOIN theme_table_dimension ttd 
         ON us.theme_table_id = ttd.theme_table_id 
       WHERE us.UUID = ?`,
      [userId]
    );

    res.json({      
      theme: userSettings[0]?.theme_name || 'light'
    });
    

  } catch (error) {
    console.error('Fetch theme error:', error);
    res.status(500).json({ error: 'Failed to fetch theme' });
  }
};
export default {
  get: (req, res) => {
    const data = {
      currentYear: new Date().getFullYear(),
      url: req.protocol + 's://' + req.get('host') + req.originalUrl,
      title: 'Exercise Tracker' 
    };
    
    res.render('index', data)
  }
}
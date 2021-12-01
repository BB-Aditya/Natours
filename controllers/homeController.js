exports.getHome = (req, res) => {
  res
    .status(200)
    .json({ message: ' Hello from the server! ', status: '200 Ok' });
};

exports.postHome = (req, res) => {
  res.json({
    status: 'success',
    RequestTime: req.requestTime,
    message: 'Response for the Post request ',
  });
};

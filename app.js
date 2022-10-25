const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json()); // middleware

// custom middleware
app.use((req, res, next) => {
  console.log('Hello from Middleware');
  next(); // if we doesnot use this then our req response cyle get struck
});

app.use((req, res, next) => {
  // modifying req in middleware
  req.requestTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log('requestTime', req.requestTime);
  res.status(200).json({
    status: 'success',
    result: tours.length,
    reuestedAt: req.requestTime,
    data: {
      tours: tours,
    },
  });
};

const getTour = (req, res) => {
  // to get hold of parameters in the specified url
  // can have any number of parameters /:id /:area/:pid etc
  // to  mark any parametr optional  /:id /:area?/:pid , use question mark
  if (req.params.id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id Found ...',
    });
  }
  const tour = tours.find((t) => t.id === req.params.id * 1);
  //  req.params.id * 1::: converts string into number

  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);
  // res.send(req.body);
  const newId = Number(tours[tours.length - 1].id) + 1;

  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  // update functionality will be written later on
};

/*
app.get('/api/v1/tours', getAllTours);

app.get('/api/v1/tours/:id', getTour);

app.post('/api/v1/tours', createTour);

app.patch('/api/v1/tours/:id', updateTour);
*/

// Above Routes can also be written as :

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server has started on Port ${port}`);
});

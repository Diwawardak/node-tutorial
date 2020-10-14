const Joi = require('joi');
const express = require('express');
const { response } = require('express');
const app = express();

// adding a piece of middleware - this method returns a piece of middleware, and then we call app.use to use that middleware in the request processing pipeline
app.use(express.json());

// app.get()
// app.post()
// app.put()
// app.delete()
// all these methods correspond to http verbs / methods 

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]


// define route - specify path or url and a callback function (route handler)
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});


app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

const course = {
    id: courses.length + 1,
    name: req.body.name 
};
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const { error } = validateCourse(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course with the given ID was not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

// route = e.g.  /api/courses/1
//  ':/year/:month' = two parameters for given month and year
//  app.get('/api/posts/:year/:month', (req, res) => {

    app.get('/api/courses/:id', (req, res) => {
        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) return res.status(404).send('The course with the given ID was not found.');
        res.send(course);
    
    });


function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    
    return Joi.validate(course, schema);
}


// listen on a given port
// PORT - environment variable - value set outside of application
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
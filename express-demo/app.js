//This is a tutorial following Programming with Mosh  How to build REST API with Nodejs & Express
// https://www.youtube.com/watch?v=pKd0Rpw7O48&ab_channel=ProgrammingwithMosh
const Joi = require('joi')
const express = require('express')

const app = express()

app.use(express.json());

//CRUD Operations CREATE, READ, UPDATE, DELETE corresponds to  POST, GET, PUT, DELETE
/**
Examples below
 * app.get()
 * app.post()
 * app.put()
 * app.delete()
**/

const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' }
]

 //takes 2 arguements , the first arg is the path or url, second arg is the callback func for the http get req to this endpoint
 // ('/') is root of website
app.get('/', (req,res)=> {
    res.send("Hello World");
});

app.get('/api/courses', (req,res)=> {
    res.send(courses);
});


// to see req params object do res.send(req.params);
app.get('/api/courses/:id', (req,res)=> {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404 error code if the request fails on getting course id
    if(!course) return res.status(404).send('Error code 404 COURSE ID NOT FOUND')
    res.send(course)
});

// id is asigned auto by a actual database
app.post('/api/courses', (req,res) =>{
    //define schema for joi validation, package to validate input

    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);
    console.log(result);
    if(result.error){
        // i can change to send any result
        res.status(400).send(result.error);
        return;
    }


    //use postman to test sending via req.body object
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course)
    res.send(course);
});

app.put('/api/courses/:id', (req,res)=> {
//look up the course if ir doesn't exist return 404 error
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send('Error code 404 COURSE ID NOT FOUND')
    res.send(course)

    //validate, if invalid return 400 bad req
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    const result = schema.validate(req.body);


    // can call this instead
    const result2 = validateCourse(req.body)
    const {error} = validateCourse(req.body) //eqiv to result.error this is object destructing


    if(result.error){
        // i can change to send any result
        res.status(400).send(result.error.details[0].message);
        return;
    }

    // Update course
    course.name = req.body.name;
    res.send(course);


});


app.delete('/api/course/:id', (req,res)=>{
    const course = courses.find(c => c.id === parseInt(req.params.id));
    // 404 error code if the request fails on getting course id
    if(!course) return res.status(404).send('Error code 404 COURSE ID NOT FOUND')
    res.send(course)

    const index = courses.indexOf(course);
    course.splice(index,1);
    res.send(course);
})


//can put validator in seperate func
//validate, if invalid return 400 bad req
function validateCourse (course){
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}


// 2 args, 1st is port # , 2nd is optional and can be another func
//PORT
const port = process.env.PORT || 3000
//set process env var by export PORT = 5050 or whatever you want
app.listen(port, () => console.log (`Listening on port ${port}...`));

//nodemon is a way to have the local host changes automatically with editor changes

//from chat gpt
// req.query:

// req.query is used to access the query parameters in the URL. Query parameters are the key-value pairs that appear after the ? in the URL.
// For example, in the URL http://example.com/search?q=hello&page=2, the query parameters are q=hello and page=2.
// In Express.js, you can access these parameters using req.query.q and req.query.page.
// Example:

// javascript
// Copy code
// // If the URL is http://example.com/search?q=hello&page=2
// console.log(req.query.q); // Outputs: 'hello'
// console.log(req.query.page); // Outputs: '2'
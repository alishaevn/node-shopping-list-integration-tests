'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  app,
  runServer,
  closeServer
} = require('../server');

const expect = chai.expect;
chai.use(chaiHttp);

describe('Recipes', function () {

  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  /*****************************
   GET
   *****************************/

  it('should return recipes on GET', function () {

    return chai.request(app)
      .get('/recipes')
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');
        expect(res.body.length).to.be.at.least(1);

        const expectedKeys = ['id', 'name', 'ingredients'];
        // loop over each object(recipe) in the response.body
        res.body.forEach(function (recipe) {
          expect(recipe).to.be.a('object');
          expect(recipe).to.include.keys(expectedKeys);
        });
      });
    });


  /*****************************
   POST
   *****************************/

  it('should add a recipe on POST', function () {
    const newRecipe = {
      name: 'pizza',
      ingredients: ['dough', 'sauce']
    };
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function (res) {
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.include.keys('id', 'name', 'ingredients');
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(Object.assign(newRecipe, {
          id: res.body.id
        }));
      });
    });


  /*****************************
   PUT
   *****************************/

  it('should update a recipe on PUT', function () {
    const updatedRecipe = {
      name: 'soup',
      ingredients: ['broth', 'mushrooms']
    };
    
    return chai.request(app)
      .get('/recipes')
      .then(function (res) {
        updatedRecipe.id = res.body[0].id;

        return chai.request(app)
          .put(`/recipes/${updatedRecipe.id}`)
          .send(updatedRecipe);
      })
      .then(function (res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('object');
        expect(res.body).to.deep.equal(updatedRecipe);
      });
  });



  /*****************************
   DELETE
   *****************************/

  it('should delete a recipe', function(){

    return chai.request(app)
      .get('/recipes')
      .then(function(res) {
        return chai.request(app)
          .delete(`/recipes/${res.body[0].id}`);
      })
      .then(function(res) {
        expect(res).to.have.status(204);
      });
    });
  });
// Write your tests here
const server = require('./server')
const request = require('supertest')


describe('server.js', () => {

  test('should check for testing env', () => {
    expect(process.env.DB_ENV).toBe('testing')
  })

  describe('POST', () => {

    test('should return 200 OK', () => {
      return request(server)
        .get('/')
          .then(res => {
            expect(res.status).toBe(200)
          })
    })

    test('should have a response body of JSON', () => {
      return request(server)
        .get('/')
          .then(res => {
            expect(res.type).toBe('application/json')
          })
    })

    test('should return {api:"up"}', () => {
      return request(server)
        .get('/')
          .then(res => {
            expect(res.body).toEqual({ api:"up" })
          })
    })
    
    
    
  })
  
})
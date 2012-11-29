var assert = require('assert');
var Browser = require("zombie");
var ready = require('readyness');


global.host = 'localhost';
var AM = require('../app/server/modules/account-manager');
var amConnected = ready.waitFor("database");

// Wait for the DB connection to be loaded before running tests
setTimeout( function() {
    AM.getAllRecords(function(){
        amConnected(); 
    });
}, 2000);

Browser.debug = false; // set to true for console logging of browser data
Browser.maxWait = 1; // time for browser to wait for page to load
Browser.site = 'http://localhost:8080';
browser = new Browser();

describe('/ user interface', function() {
    var url = '/';
    var name = 'test-user';
    var email = 'test@email.com';
    var user = 'test-user';
    var pass = 'test-pass';
    var country = '';
	
    // prior to running test, load browser URL
    before(function(done) {
        browser.visit(url).
        finally(done);
    });

    // Nothing to cleanup
    after(function(done) {
        done();
    });

    it('should load the / page', function() {
        assert.ok(browser.success);
        assert.equal(browser.location.pathname, "/");
    });

    it('should display a login page', function() {
        assert.ok(browser.query("#login-form"), "Login form is missing (#login-form)");
    });

    it('should display link to create an account', function() {
        assert.ok(browser.query("#create-account"), "Create Account link is missing (#create-account)");
    });
    
    it('should display a link to find a lost password', function(){
        assert.ok(browser.query("#forgot-password"), "Forgot Password link is missing (#forgot-password)");
    });
    
});

describe('/ smoke test', function() {
    var url = '/';
    var name = 'test-user';
    var email = 'test@email.com';
    var user = 'test-user';
    var pass = 'test-pass';
    var country = '';
	
    // Prior to running the tests, create a test user
    before(function(done) {
        AM.signup({
            name: name,
            email: email,
            user: user,
            pass: pass,
            country: country
        }, function(e, o, done) {
            
        });
        browser.visit(url).
        finally(done);
    });

    // When the tests are complete, delete the test-user we've created
    after(function(done) {
        AM.getEmail(email, function(o) {
            AM.deleteByEmail(email, function(e, obj){
                if (e)
                {
                    console.log("error deleting "+e);
                }
                done();
            });
        });
    });
    
    it('should show you an error with invalid username', function(done){
        var test_name = "bad-user";
        var test_pass = "bad-pass";
        browser.
            fill("user", test_name).
            fill("pass", test_pass).
            pressButton("Sign in").
            then(function() {
                assert.equal(browser.text('.modal-alert .modal-body p'),
                    "Please check your username and/or password", 
                    "User allowed to login with invalid user/pass");
            }).
            then(done, done);
    });

    it('should allow you to login', function(done){
        browser.
            fill("user", name).
            fill("pass", pass).
            pressButton("Sign in"). 
            then(function() {
                assert.equal(browser.location.pathname, "/home", 
                    "Unable to login with "+name+": "+pass);
            }).
            then(function() {
                browser.pressButton("Sign Out")
            }).
            then(done,done);
    });

});
    

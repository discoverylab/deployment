/**
 * Created by mbalumur on 12/12/2014.
 */

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');

// Get list of things
exports.index = function(req, res) {

  var https = require('https');
  var ticket = req.params.ticket_id;
  var quizid = req.params.quiz_id;

  /**
   * HOW TO Make an HTTP Call - GET
   */
// options for GET
  var optionsget;

  if(typeof quizid != "undefined" && quizid != null && quizid != "undefined"){
    optionsget= {
      host : 'weblogin.asu.edu', // here only the domain name
      // (no http/https !)
      port : 443,
      path : '/cas/serviceValidate?service=https%3A%2F%2Fdiscovery.a2c2.asu.edu%2F%3Fquizid='+ quizid + '&ticket=' + ticket, // the rest of the url with parameters if needed
      method : 'GET' // do GET
    };
  } else{
    optionsget = {
      host : 'weblogin.asu.edu', // here only the domain name
      // (no http/https !)
      port : 443,
      path : '/cas/serviceValidate?service=https%3A%2F%2Fdiscovery.a2c2.asu.edu&ticket=' + ticket, // the rest of the url with parameters if needed
      method : 'GET' // do GET
    };
  }


  console.info('Options prepared:');
  console.info(optionsget);
  console.info('Do the GET call');

  var output = {status:false, user:''};

// do the GET request
  var reqGet = https.request(optionsget, function(response) {
    console.log("statusCode: ", response.statusCode);
    // uncomment it for header details
//  console.log("headers: ", res.headers);


    response.on('data', function(d) {
      //console.info('GET result:\n');
      //process.stdout.write(d);
      var parseString = require('xml2js').parseString;
      var xml = d;
      parseString(xml, function (err, result) {
        var response = result["cas:serviceResponse"];
        var success = response["cas:authenticationSuccess"];

        if(success){

          var casuser = success[0]["cas:user"][0];
          console.log('valid: ' + casuser);

          var profileoptionsget = {
            host : 'webapp4.asu.edu', // here only the domain name
            // (no http/https !)
            port : 443,
            path : '/directory/ws/search?asuriteId=' + casuser, // the rest of the url with parameters if needed
            method : 'GET' // do GET
          };

          var profilereqGet = https.request(profileoptionsget, function(response) {
            console.log("statusCode: ", response.statusCode);

            response.on('data', function(pd) {
              //console.info('GET result:\n');
              //process.stdout.write(pd);

              var profilexml = pd;
              parseString(profilexml, function (error, profileresult) {
                //console.dir(profileresult);
                console.log(profileresult);
                var searchresult = profileresult.searchResults;
                if(searchresult != ''){
                  var asuuser = {id:'', email: '', name: '', type:true};
                  asuuser.id =  casuser;
                  asuuser.email = searchresult.person[0].email[0];
                  asuuser.name = searchresult.person[0].displayName[0];
                  output.status = true;
                  output.user = asuuser;
                  res.json(output);
                } else{
                  res.status(401).send();
                }

              });

            });
          });

          profilereqGet.end();
          profilereqGet.on('error', function(e) {
            console.error(e);
            res.status(401).send();
          });

        }
        else{
          res.status(401).send();
        }


      });

      console.info('Call completed');
    });

  });

  reqGet.end();
  reqGet.on('error', function(e) {
    console.error(e);
    res.status(401).send();
  });


};

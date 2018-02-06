//
// FaceFinder using Azure Cognitive Services API
//
// Property of Tech@LC
// Anthony Krivonos 2018

//
// Prerequisites for getting the FaceFinder service to work
//

// Package imports
const request = require('request');
const queryString = require('query-string');

// Microsoft Azure API Key and FACE_API_ENDPOINT
const API_KEY = "bc49ade9306a4ee4a908fea4a9c59b16";
const FACE_API_ENDPOINT = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0";

//
// Components of HTTP Requests
//

// Headers: define what kind of information we're sending to the server and tell the server we have
//          the right to access their information because of our API key
const headers = {
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": API_KEY
}
// Parameters: tell the server that we are querying/looking for a specific set of data, and want it
//             in the appropriate format
const parameters ={
      "returnFaceId": "true",
      "returnFaceLandmarks": "false",
      "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
}
// Body: contains the url of the image we'd like to analyze for face
const body = {
      "url": ""
}
// Options: contain the endpoint we'd like to query plus the query strings that will specify
//          what kind of data we'd like to receive. 'POST' requests send data to the server.
var options = {
      uri: `https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?${queryString.stringify(parameters)}`,
      headers: headers,
      method: 'POST',
      json: body
};

// The request import is a ready-built function for sending requests
// Once we get our response from the server, we will pretty-print it in the console
// Think of this as our "main" function: it is a call, not a declaration, so it will always run.
request(options, (error, response, body) => {
      // A status code of 200 for any kind of HTTP request is OK
      // For more HTTP request status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      if (!error && response.statusCode == 200) {
            console.log(JSON.stringify(body, null, 2));
            console.log(getAgeFromBody(body));
            console.log(getEmotionFromBody(body));
      }
});

//
// Extension Functions
//

// Scrape the response body object for the age property and return it.
function getAgeFromBody(body) {
      let age = body[0].faceAttributes.age;
      return age;
}

// Loop through all emotions and record the greatest perceived emotion.
// This emotion will be the one we will conclude the subject is feeling.
function getEmotionFromBody(body) {
      let moods = body[0].faceAttributes.emotion;
      var greatestEmotion, greatestEmotionValue;
      for (var mood in moods) {
            if (moods[mood] && (!greatestEmotion || moods[mood] > greatestEmotionValue)) {
                  greatestEmotion = mood;
                  greatestEmotionValue = moods[mood];
            }
      }
      return greatestEmotion;
}

// TODO: Write an isBaldFromBody(body) function that takes the response body as a parameter
//       and returns a boolean indicating whether or not the subject is bald.

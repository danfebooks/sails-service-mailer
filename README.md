# sails-service-mailer
Email Service for Sails framework

[![npm version](https://badge.fury.io/js/%40danfebooks%2Fsails-service-mailer.svg)](https://badge.fury.io/js/%40danfebooks%2Fsails-service-mailer)

## List of supported mail transports

- Direct (sends email directly to MX server)
- SendGrid ([SendGrid API](https://sendgrid.com/docs/api-reference/))
- Sendmail (sends email via sendmail)
- Amazon SES (sends email via Amazon SES services)
- SMTP (sends email via some of SMTP servers)
- Stub (stub sending of email)

## Getting Started

Install this module.

```shell
npm install @danfebooks/sails-service-mailer
```

Then import it in your service and create mailer instance.


```javascript
// api/services/MailerService.js
import MailerService from '@danfebooks/sails-service-mailer';

// Note: If you are using commonjs `require`, then please use
const MailerService = require('@danfebooks/sails-service-mailer').default;


export default MailerService('sendmail', {
  from: 'no-reply@my-project.com',
  subject: 'Hello, there',
  provider: {
    path: '/usr/bin/sendmail'
  }
});

// api/controllers/MailController.js
export default {
  send: function(req, res) {
    MailerService
      .send({
        to: req.param('to'),
        text: 'And of course, Hello World!'
      })
      .then(res.ok)
      .catch(res.negotiate);
  }
};
```

## Configuration

There is two kind of configuration - provider configuration and mail configuration.

When you instantiate new instance of mailer, in configuration object you can add `provider` object.
This object will send directly to one of nodemailer transports.

And all keys that don't belongs to `provider` will send directly to `sendMail` function.

So basic configuration can be:

```javascript
let mailer = MailerService('direct', {
  from: 'no-reply@some.com' // this will go to sendMail,
  provider: { // this will go to nodemailer.createTransport
    name: 'some.mx-server.com'
  }
});
```

Each of available options you can find in nodemailer transport repositories or a little bit below in examples.

- Mail options you can find [here](http://www.nodemailer.com/#e-mail-message-fields).
- Provider options you can find in appropriate repository of nodemailer transports.

## API

Each of Mailer instances has only one method:

### send(config)

`config` - Configuration object with mail options like `from`, `to`, etc... It will mix up to the pre-defined config.
All allowed options for this object you can find [here](http://www.nodemailer.com/#e-mail-message-fields).

Returns Promise.

## Examples

All of this examples contains all the provider configuration keys. And most of them is optional.

### DirectMailer

```javascript
let direct = MailerService('direct', {
  from: 'no-reply@danfebooks.com',
  provider: {
    name: '<MX_HOSTNAME>', // hostname to be used when introducing the client to the MX server
    debug: false // if true, the connection emits all traffic between client and server as `log` events
  }
});
```

### SendGridMailer

```javascript
let sendGrid = MailerService('sendgrid', {
  from: 'no-reply@danfebooks.com',
  provider: {
    auth: {
      api_key: '<SENDGRID_APIKEY>' // SendGrid API KEY
    }
  }
});
```

### SendMailMailer

```javascript
let sendmail = MailerService('sendmail', {
  from: 'no-reply@danfebooks.com',
  provider: {
    path: '/usr/bin/sendmail', // path to the sendmail command
    args: [] // an array of extra command line options to pass to the `sendmail` command
  }
});
```

### SESMailer

```javascript
let ses = MailerService('ses', {
  from: 'no-reply@danfebooks.com',
  provider: {
    ses: {}, // instantiated AWS SES object with new AWS.SES()
    accessKeyId: 'MY_KEY', // AWS access key
    secretAccessKey: 'MY_SECRET', // AWS secret key
    sessionToken: '', // Session token
    region: '', // Specify the region to send the service request
    httpOptions: {}, // A hash of options to pass to the low-level AWS HTTP request
    rateLimit: 5 // Specify the amount of messages can be sent in 1 second
  }
});
```

### SMTPMailer

```javascript
let smtp = MailerService('smtp', {
  from: 'no-reply@danfebooks.com',
  provider: {
    port: 25, // The port to connect to
    host: 'localhost', // The hostname to connect to
    secure: false, // Defines if the connection should use SSL
    auth: { // Defines authentication data
      user: '', // Username
      pass: '', // Password
      xoauth2: '' // OAuth2 access token
    },
    ignoreTLS: false, // Turns off STARTTLS support if true
    name: '', // Options hostname of the client
    localAddress: '', // Local interface to bind to for network connections
    connectionTimeout: 2000, // How many ms to wait for the connection to establish
    greetingTimeout: 2000, // How many ms to wait for the greeting after connection
    socketTimeout: 2000, // How many ms of inactivity to allow
    debug: false, // If true, the connection emits all traffic between client and server as `log` events
    authMethod: 'PLAIN', // Defines preferred authentication method
    tls: {} // Defines additional options to be passed to the socket constructor
  }
});
```

### StubMailer

```javascript
let stub = MailerService('stub', {
  from: 'no-reply@danfebooks.com',
  provider: {
    error: new Error('Invalid recipient') // If you want that sending will fail and return error
  }
});
```
